from __future__ import annotations

import json
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:4188"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
VIEWPORTS = {
    "desktop-1440": (1440, 1000),
    "desktop-1024": (1024, 900),
    "tablet-768": (768, 900),
    "mobile-390": (390, 844),
}
DRAFT_PATHS = [
    "/knowledge/ai-basics/what-is-agent/",
    "/knowledge/startup-45/day-01-start-with-problems/",
    "/knowledge/enterprise-ai/interview-before-solution/",
    "/knowledge/products/minimum-viable-ai-tool/",
    "/knowledge/content-assets/one-insight-many-formats/",
]


def main() -> None:
    if not CHROME.exists():
        raise RuntimeError(f"Chrome executable not found: {CHROME}")

    output_dir = Path(tempfile.gettempdir()) / "knowledge-playwright-qa"
    output_dir.mkdir(exist_ok=True)
    report: dict[str, object] = {"screenshots": str(output_dir), "viewports": {}}

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=str(CHROME),
        )
        request = playwright.request.new_context(base_url=BASE_URL)

        sitemap_response = request.get("/sitemap.xml")
        assert sitemap_response.ok, "sitemap is unavailable"
        sitemap = sitemap_response.text()
        assert f"{BASE_URL}/knowledge/" not in sitemap  # sitemap uses production URL
        assert "https://gonghejian.cn/knowledge/" in sitemap
        for path in DRAFT_PATHS:
            assert path not in sitemap, f"draft leaked into sitemap: {path}"
            assert request.get(path).status == 404, f"draft route is public: {path}"

        robots_response = request.get("/robots.txt")
        assert robots_response.ok, "robots.txt is unavailable"
        assert "Sitemap: https://gonghejian.cn/sitemap.xml" in robots_response.text()

        for name, (width, height) in VIEWPORTS.items():
            page = browser.new_page(viewport={"width": width, "height": height})
            console_errors: list[str] = []
            request_failures: list[str] = []
            bad_responses: list[str] = []
            page.on(
                "console",
                lambda message: console_errors.append(message.text)
                if message.type == "error"
                else None,
            )
            page.on("pageerror", lambda error: console_errors.append(str(error)))
            page.on("requestfailed", lambda failed: request_failures.append(failed.url))
            page.on(
                "response",
                lambda response: bad_responses.append(
                    f"{response.status} {response.url}"
                )
                if response.status >= 400
                else None,
            )

            response = page.goto(f"{BASE_URL}/knowledge/", wait_until="networkidle")
            assert response and response.ok
            assert page.locator("h1").first.inner_text() == "企业AI现场工作簿"
            assert page.locator(".knowledge-category").count() == 5
            assert page.locator("[data-knowledge-item]").count() == 0
            assert page.locator(".knowledge-article-list .knowledge-article-row").count() == 0
            assert page.locator(".knowledge-tags a").count() == 0
            assert page.locator(".knowledge-section-empty").is_visible()
            assert page.locator(".knowledge-section-empty-inline").is_visible()
            assert page.locator('.knowledge-category-meta > span').evaluate_all(
                "els => els.every(el => el.textContent.trim() === '0 篇记录')"
            )

            canonical = page.locator('link[rel="canonical"]').get_attribute("href")
            assert canonical == "https://gonghejian.cn/knowledge/"
            assert page.locator('meta[property="og:title"]').get_attribute("content")
            assert page.locator('meta[property="og:description"]').get_attribute("content")

            overflow = page.evaluate(
                "document.documentElement.scrollWidth - window.innerWidth"
            )
            assert overflow <= 1, f"{name}: horizontal overflow {overflow}px"

            nav_visible = page.locator(".site-nav").is_visible()
            menu_visible = page.locator(".mobile-menu-toggle").is_visible()
            if width > 768:
                assert nav_visible, f"{name}: desktop navigation is hidden"
            else:
                assert menu_visible, f"{name}: mobile menu control is hidden"

            category = page.locator(".knowledge-category").first
            category_title = category.locator("strong")
            color_before = category_title.evaluate("el => getComputedStyle(el).color")
            category.hover()
            color_after = category_title.evaluate("el => getComputedStyle(el).color")
            assert color_before != color_after, f"{name}: category hover has no feedback"

            search = page.locator("#knowledgeSearchInput")
            search.fill("企业")
            search.press("Enter")
            assert page.locator("#knowledge-results").is_visible()
            assert page.locator("#knowledgeEmpty").is_visible()
            assert "找到 0 篇记录" in page.locator("#knowledgeResultsStatus").inner_text()
            page.locator("#knowledgeClear").click()

            screenshot = output_dir / f"knowledge-{name}.png"
            page.screenshot(path=str(screenshot), full_page=True)
            assert not console_errors, f"{name}: console errors: {console_errors}"
            assert not request_failures, f"{name}: request failures: {request_failures}"
            assert not bad_responses, f"{name}: HTTP errors: {bad_responses}"

            report["viewports"][name] = {
                "width": width,
                "homeOverflow": overflow,
                "navVisible": nav_visible,
                "menuVisible": menu_visible,
                "publicArticles": 0,
                "hoverColor": {"before": color_before, "after": color_after},
                "consoleErrors": console_errors,
                "requestFailures": request_failures,
                "badResponses": bad_responses,
            }
            page.close()

        request.dispose()
        browser.close()

    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

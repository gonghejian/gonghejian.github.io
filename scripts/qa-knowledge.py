"""Browser-level release checks for the generated knowledge base."""

from __future__ import annotations

import os
import shutil
import threading
import urllib.error
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "_site"
DRAFT_PATHS = [
    "/knowledge/ai-basics/what-is-agent/",
    "/knowledge/startup-45/day-01-start-with-problems/",
    "/knowledge/enterprise-ai/interview-before-solution/",
    "/knowledge/products/minimum-viable-ai-tool/",
    "/knowledge/content-assets/one-insight-many-formats/",
]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, _format: str, *_args: object) -> None:
        return


class QuietServer(ThreadingHTTPServer):
    def handle_error(self, _request: object, _client_address: object) -> None:
        return


def assert_true(condition: bool, label: str) -> None:
    if not condition:
        raise AssertionError(label)
    print(f"PASS  {label}")


def build_driver() -> webdriver.Chrome:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1440,1100")
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

    chrome = (
        Path(os.environ.get("PROGRAMFILES", "C:/Program Files"))
        / "Google"
        / "Chrome"
        / "Application"
        / "chrome.exe"
    )
    if chrome.exists():
        options.binary_location = str(chrome)

    explicit_driver = os.environ.get("CHROMEDRIVER") or shutil.which("chromedriver")
    service = Service(explicit_driver) if explicit_driver else Service()
    return webdriver.Chrome(service=service, options=options)


def main() -> None:
    assert_true((SITE / "knowledge" / "index.html").exists(), "knowledge homepage was built")
    assert_true((SITE / "404.html").exists(), "custom 404 page exists")
    assert_true((SITE / "robots.txt").exists(), "robots.txt exists")

    sitemap = (SITE / "sitemap.xml").read_text(encoding="utf-8")
    assert_true("https://gonghejian.cn/knowledge/" in sitemap, "sitemap includes knowledge homepage")
    for path in DRAFT_PATHS:
        assert_true(path not in sitemap, f"sitemap excludes draft {path}")

    handler = partial(QuietHandler, directory=str(SITE))
    server = QuietServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{server.server_port}"

    try:
        with urllib.request.urlopen(f"{base}/knowledge/", timeout=5) as response:
            assert_true(response.status == 200, "knowledge homepage returns 200")

        for path in DRAFT_PATHS:
            try:
                urllib.request.urlopen(f"{base}{path}", timeout=5)
                raise AssertionError(f"draft unexpectedly returned 200: {path}")
            except urllib.error.HTTPError as error:
                assert_true(error.code == 404, f"draft route returns 404: {path}")

        driver = build_driver()
        try:
            driver.get(f"{base}/knowledge/")
            assert_true(driver.title.startswith("弓箭的企业AI现场工作簿"), "homepage title is correct")
            assert_true(len(driver.find_elements(By.CSS_SELECTOR, ".knowledge-category")) == 5, "five category entries render")
            assert_true(not driver.find_elements(By.CSS_SELECTOR, "[data-knowledge-item]"), "no draft enters the search index")
            assert_true(not driver.find_elements(By.CSS_SELECTOR, ".knowledge-article-row"), "no draft enters recent updates")
            assert_true(not driver.find_elements(By.CSS_SELECTOR, ".knowledge-tags a"), "no draft tag enters the public index")
            assert_true(bool(driver.find_element(By.CSS_SELECTOR, 'link[rel="canonical"]').get_attribute("href")), "homepage canonical exists")
            assert_true(bool(driver.find_element(By.CSS_SELECTOR, 'meta[property="og:title"]').get_attribute("content")), "homepage OpenGraph title exists")

            search = driver.find_element(By.ID, "knowledgeSearchInput")
            search.send_keys("企业")
            driver.find_element(By.CSS_SELECTOR, "#knowledgeSearch button").click()
            assert_true(driver.find_element(By.ID, "knowledgeEmpty").is_displayed(), "empty search state is visible")

            driver.set_window_size(390, 844)
            driver.get(f"{base}/knowledge/")
            no_overflow = driver.execute_script(
                "return document.documentElement.scrollWidth <= window.innerWidth + 1"
            )
            assert_true(bool(no_overflow), "mobile homepage has no horizontal overflow")
            assert_true(driver.find_element(By.CSS_SELECTOR, ".mobile-menu-toggle").is_displayed(), "mobile navigation control is visible")

            severe_logs = [
                entry for entry in driver.get_log("browser") if entry.get("level") == "SEVERE"
            ]
            assert_true(not severe_logs, f"browser console has no severe errors: {severe_logs}")
        finally:
            driver.quit()
    finally:
        server.shutdown()
        server.server_close()

    print("Knowledge Base V1-RC1 browser acceptance passed")


if __name__ == "__main__":
    main()

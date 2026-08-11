(function () {
    'use strict';

    const form = document.getElementById('knowledgeSearch');
    const input = document.getElementById('knowledgeSearchInput');
    const results = document.getElementById('knowledge-results');
    const title = document.getElementById('knowledge-results-title');
    const status = document.getElementById('knowledgeResultsStatus');
    const empty = document.getElementById('knowledgeEmpty');
    const clear = document.getElementById('knowledgeClear');
    const categories = document.getElementById('knowledgeCategories');
    const items = Array.from(document.querySelectorAll('[data-knowledge-item]'));

    if (!form || !input || !results || !status || !empty || !clear || !title) return;

    const normalize = (value) => String(value || '').trim().toLocaleLowerCase('zh-CN');

    function applyFilters(updateUrl) {
        const params = new URLSearchParams(window.location.search);
        const query = normalize(input.value);
        const category = updateUrl ? '' : (params.get('category') || '');
        const tag = updateUrl ? '' : (params.get('tag') || '');

        let visibleCount = 0;
        items.forEach((item) => {
            const matchesQuery = !query || normalize(item.dataset.search).includes(query);
            const matchesCategory = !category || item.dataset.category === category;
            const tags = (item.dataset.tags || '').split('|');
            const matchesTag = !tag || tags.includes(tag);
            const visible = matchesQuery && matchesCategory && matchesTag;
            item.hidden = !visible;
            if (visible) visibleCount += 1;
        });

        const active = Boolean(query || category || tag);
        results.hidden = !active;
        if (categories) categories.hidden = active;
        empty.hidden = visibleCount !== 0;

        if (category) {
            const categoryLink = document.querySelector(`[data-category-link="${CSS.escape(category)}"]`);
            title.textContent = categoryLink ? categoryLink.querySelector('strong').textContent : '分类记录';
        } else if (tag) {
            title.textContent = `标签：${tag}`;
        } else {
            title.textContent = query ? `搜索：${input.value.trim()}` : '检索结果';
        }

        status.textContent = active ? `找到 ${visibleCount} 篇记录` : '';

        if (updateUrl) {
            if (query) params.set('q', input.value.trim()); else params.delete('q');
            params.delete('category');
            params.delete('tag');
            const next = params.toString() ? `${window.location.pathname}?${params}` : window.location.pathname;
            window.history.replaceState({}, '', next);
        }
    }

    const initialParams = new URLSearchParams(window.location.search);
    input.value = initialParams.get('q') || '';
    applyFilters(false);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters(true);
        if (!results.hidden) results.scrollIntoView({ block: 'start' });
    });

    input.addEventListener('input', () => {
        if (!input.value.trim() && new URLSearchParams(window.location.search).has('q')) applyFilters(true);
    });

    clear.addEventListener('click', () => {
        input.value = '';
        window.history.replaceState({}, '', window.location.pathname);
        applyFilters(false);
        input.focus();
    });
}());

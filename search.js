// search.js - 全局搜索功能（使用JavaScript驱动跳转，避免href属性问题）

// 网站页面索引数据
const sitePages = [
    { url: 'index.html', title: '首页', description: '长板首页介绍，包括长板定义、图片、玩法概览等。' },
    { url: 'gaishu.html', title: '长板概述', description: '长板的历史、结构、玩法流派等概述。' },
    { url: 'play.html', title: '玩法', description: '长板的各种玩法：代步、速降、舞蹈、平花等。' },
    { url: 'competition.html', title: '赛事', description: '长板行业赛事、短距离比赛、长途拉力赛、Ultraskate、国内赛事等。' },
    { url: 'famous.html', title: '著名人物', description: '黎建鹏、高孝周、Hans Wouters、Lotfi Lamaali等著名滑手介绍。' },
    { url: 'me.html', title: '联系我们', description: '联系方式、微信、QQ邮箱。' }
];

/**
 * 获取当前页面的基础路径（目录部分）
 * @returns {string} 基础路径，例如 '/' 或 '/subdir/'
 */
function getBasePath() {
    const path = window.location.pathname;
    const lastSlash = path.lastIndexOf('/');
    return lastSlash !== -1 ? path.substring(0, lastSlash + 1) : '/';
}

/**
 * 获取URL查询参数
 * @param {string} param - 参数名
 * @returns {string|null} 参数值或null
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * 执行搜索（不区分大小写）
 * @param {string} query - 搜索关键词
 * @returns {Array} 匹配的页面数组
 */
function performSearch(query) {
    if (!query) return [];
    query = query.toLowerCase();
    return sitePages.filter(page => 
        page.title.toLowerCase().includes(query) || 
        page.description.toLowerCase().includes(query)
    );
}

/**
 * 处理搜索结果链接点击
 * @param {MouseEvent} e
 */
function onResultClick(e) {
    const target = e.target.closest('.search-result-link');
    if (!target) return;
    e.preventDefault(); // 阻止默认（如果有href）
    const url = target.dataset.url;
    if (url) {
        console.log('搜索结果点击，跳转至:', url);
        window.location.href = url;
    } else {
        console.error('搜索结果链接缺少 data-url 属性');
    }
}

/**
 * 在搜索结果页显示结果
 * @param {Array} results - 搜索结果数组
 * @param {string} query - 原始搜索词
 */
function displayResults(results, query) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = `<h2>没有找到与“${query}”相关的内容。</h2>`;
        return;
    }

    // 获取当前目录，用于构建绝对链接
    const basePath = getBasePath();

    let html = `<h2>找到 ${results.length} 个与“${query}”相关的结果：</h2><ul>`;
    results.forEach(page => {
        // 生成绝对链接
        const fullUrl = basePath + page.url;
        // 不使用 href 属性，改用 data-url 和点击事件
        html += `<li><span class="search-result-link" data-url="${fullUrl}">${page.title}</span><br><small>${page.description}</small></li>`;
    });
    html += '</ul>';
    container.innerHTML = html;

    // 为所有搜索结果链接添加点击事件监听（事件委托）
    container.addEventListener('click', onResultClick);

    console.log('搜索结果已渲染，链接指向:', results.map(p => basePath + p.url));
}

/**
 * 初始化搜索按钮（用于所有非搜索结果页）
 */
function initSearchButton() {
    const btn = document.getElementById('searchBtn');
    const input = document.getElementById('searchInput');
    if (btn && input) {
        btn.addEventListener('click', function() {
            const q = input.value.trim();
            if (!q) {
                alert('请输入搜索关键词');
                return;
            }
            window.location.href = `search.html?q=${encodeURIComponent(q)}`;
        });
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') btn.click();
        });
    }
}

/**
 * 初始化搜索结果页
 */
function initSearchPage() {
    const q = getQueryParam('q');
    if (q) {
        const results = performSearch(q);
        displayResults(results, q);
    } else {
        displayResults([], '');
    }
}

// 根据当前页面执行不同初始化
if (window.location.pathname.endsWith('search.html') || window.location.pathname.endsWith('search')) {
    document.addEventListener('DOMContentLoaded', initSearchPage);
} else {
    document.addEventListener('DOMContentLoaded', initSearchButton);
}
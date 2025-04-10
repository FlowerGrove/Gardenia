/**
 * 网页导航脚本
 * 实现网站搜索、分类过滤和夜间模式功能
 */

// 网站数据
const websiteData = [
    { 
        name: "百度", 
        url: "https://www.baidu.com", 
        logo: "assets/icons/baidu.ico", 
        category: "搜索引擎" 
    },
    { 
        name: "哔哩哔哩", 
        url: "https://www.bilibili.com", 
        logo: "assets/icons/bilibili.ico", 
        category: "视频" 
    },
    { 
        name: "知乎", 
        url: "https://www.zhihu.com", 
        logo: "assets/icons/zhihu.ico", 
        category: "社区" 
    },
    { 
        name: "淘宝", 
        url: "https://www.taobao.com", 
        logo: "assets/icons/taobao.ico", 
        category: "购物" 
    },
    { 
        name: "京东", 
        url: "https://www.jd.com", 
        logo: "assets/icons/jd.ico", 
        category: "购物" 
    },
    { 
        name: "网易", 
        url: "https://www.163.com", 
        logo: "assets/icons/163.ico", 
        category: "门户" 
    },
    { 
        name: "腾讯", 
        url: "https://www.qq.com", 
        logo: "assets/icons/qq.ico", 
        category: "门户" 
    },
    { 
        name: "微博", 
        url: "https://www.weibo.com", 
        logo: "assets/icons/weibo.ico", 
        category: "社交" 
    },
    { 
        name: "GitHub", 
        url: "https://github.com", 
        logo: "assets/icons/github.ico", 
        category: "开发" 
    }
];

// 向window暴露网站数据，供time.js使用
window.websiteData = websiteData;

// 收藏夹存储
let favorites = [];

// 网站访问历史
let visitHistory = [];

// 站点启动时间
const startTime = new Date();

// 设备识别信息
let deviceInfo = {
    macAddress: null,
    isMobile: false,
    lastVisit: null
};

document.addEventListener('DOMContentLoaded', function() {
    // 检测设备信息
    detectDevice();
    
    // 加载收藏夹和历史记录
    loadFavoritesAndHistory();
    
    // 加载自定义网站
    loadCustomWebsites();
    
    // 加载图标
    loadDefaultIcons();
    
    // 初始化网站列表
    initWebsites();
    
    // 根据设备宽度初始化合适的分类选择器
    const isMobileView = window.innerWidth <= 768;
    if (isMobileView) {
        initMobileCategorySelector();
    } else {
        initCategorySelector();
    }
    
    // 设置搜索功能
    setupSearch();
    
    // 设置夜间模式切换
    setupThemeToggle();
    
    // 初始化时间显示
    initTimeDisplay();
    
    // 初始化功能按钮
    setupActionButtons();
    
    // 初始化设置
    loadSettings();
    
    // 加载历史记录
    loadVisitHistory();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleWindowResize);
    
    // 向全局暴露常用函数，便于调试问题
    window.favorites = favorites;
    window.addToFavorites = addToFavorites;
    window.removeFromFavorites = removeFromFavorites;
});

/**
 * 初始化时间显示
 */
function initTimeDisplay() {
    // 显示当前时间
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // 显示运行时间
    updateRuntime();
    setInterval(updateRuntime, 1000);
}

/**
 * 更新当前时间显示
 */
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const dateString = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    const currentTimeElement = document.querySelector('.current-time');
    if (currentTimeElement) {
        currentTimeElement.textContent = `${timeString}\n${dateString}`;
    }
}

/**
 * 更新运行时间
 */
function updateRuntime() {
    const now = new Date();
    const diff = now - startTime; // 毫秒差
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('run-days').textContent = days;
    document.getElementById('run-hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('run-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('run-seconds').textContent = seconds.toString().padStart(2, '0');
}

/**
 * 检测设备信息
 */
function detectDevice() {
    // 检测是否为移动设备
    deviceInfo.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 如果是移动设备，隐藏分类选择器
    if (deviceInfo.isMobile) {
        const categorySelector = document.querySelector('.category-selector');
        if (categorySelector) {
            categorySelector.classList.add('mobile-hidden');
        }
    }
    
    // 获取设备指纹(简化版)
    const fingerprint = generateDeviceFingerprint();
    deviceInfo.macAddress = fingerprint;
    
    // 加载上次访问时间
    const savedDeviceInfo = localStorage.getItem('deviceInfo');
    if (savedDeviceInfo) {
        const parsedInfo = JSON.parse(savedDeviceInfo);
        deviceInfo.lastVisit = parsedInfo.lastVisit;
    }
    
    // 更新当前访问时间
    deviceInfo.lastVisit = new Date().toISOString();
    saveDeviceInfo();
    
    console.log('设备信息:', deviceInfo);
}

/**
 * 生成设备指纹
 * 注意: 这是一个简化版的设备指纹，实际中无法获取真实MAC地址
 */
function generateDeviceFingerprint() {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
        !!window.indexedDB
    ];
    
    // 生成一个基于当前设备特征的简单哈希
    let fingerprint = '';
    const str = components.join('###');
    for (let i = 0; i < str.length; i++) {
        fingerprint += str.charCodeAt(i).toString(16);
    }
    
    // 格式化为类似MAC地址的格式
    return fingerprint.slice(0, 12).match(/.{1,2}/g).join(':');
}

/**
 * 保存设备信息
 */
function saveDeviceInfo() {
    localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
}

/**
 * 设置功能按钮
 */
function setupActionButtons() {
    // 设置按钮
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.querySelector('.close-modal');
    const saveSettings = document.querySelector('.save-settings');
    
    if (settingsBtn && settingsModal) {
        // 打开设置
        settingsBtn.addEventListener('click', function() {
            settingsModal.classList.add('active');
        });
        
        // 关闭设置
        closeModal.addEventListener('click', function() {
            settingsModal.classList.remove('active');
        });
        
        // 点击模态框外部关闭
        settingsModal.addEventListener('click', function(e) {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        });
        
        // 保存设置
        saveSettings.addEventListener('click', function() {
            saveUserSettings();
            settingsModal.classList.remove('active');
        });
        
        // 设置实时预览
        setupSettingsPreview();
    }
    
    // 个人页面按钮
    const profileBtn = document.querySelector('.favorites-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = 'personal-blog.html';
        });
    }
    
    // 历史记录按钮
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            showHistory();
        });
    }
    
    // 收藏夹按钮
    const bookmarksBtn = document.querySelector('.bookmarks-btn');
    if (bookmarksBtn) {
        bookmarksBtn.addEventListener('click', function() {
            showFavorites();
        });
    }
    
    // 添加网站按钮
    const addSiteBtn = document.querySelector('.add-site-btn');
    if (addSiteBtn) {
        addSiteBtn.addEventListener('click', function() {
            showAddSiteForm();
        });
    }
    
    // 为所有动作项添加点击事件
    const actionItems = document.querySelectorAll('.action-item');
    actionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 如果点击的是.action-item本身或其span子元素（而不是按钮）
            if (e.target === this || e.target.tagName === 'SPAN') {
                // 触发内部按钮的点击事件
                const button = this.querySelector('button');
                if (button) button.click();
            }
        });
    });
}

/**
 * 设置实时预览
 */
function setupSettingsPreview() {
    const backgroundSelect = document.getElementById('background-select');
    const fontSizeRange = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const timeDisplayToggle = document.getElementById('time-display-toggle');
    
    if (backgroundSelect) {
        backgroundSelect.addEventListener('change', function() {
            previewBackground(this.value);
        });
    }
    
    if (fontSizeRange && fontSizeValue) {
        fontSizeRange.addEventListener('input', function() {
            fontSizeValue.textContent = `${this.value}px`;
            document.documentElement.style.setProperty('--font-size-base', `${this.value}px`);
        });
    }
    
    if (timeDisplayToggle) {
        timeDisplayToggle.addEventListener('change', function() {
            const timeDisplay = document.querySelector('.time-display');
            if (timeDisplay) {
                if (this.checked) {
                    timeDisplay.style.display = 'flex';
                    document.querySelector('.container').style.marginLeft = 'var(--time-display-width)';
                } else {
                    timeDisplay.style.display = 'none';
                    document.querySelector('.container').style.marginLeft = '0';
                }
            }
        });
    }
}

/**
 * 预览背景样式
 */
function previewBackground(style) {
    document.body.classList.remove('gradient-bg', 'particles-bg');
    
    if (style === 'gradient') {
        document.body.classList.add('gradient-bg');
    } else if (style === 'particles') {
        document.body.classList.add('particles-bg');
    }
}

/**
 * 保存用户设置
 */
function saveUserSettings() {
    const settings = {
        background: document.getElementById('background-select').value,
        fontSize: document.getElementById('font-size').value,
        showTime: document.getElementById('time-display-toggle').checked,
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

/**
 * 加载设置
 */
function loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (!savedSettings) return;
    
    try {
        const settings = JSON.parse(savedSettings);
        
        // 应用背景
        if (settings.background) {
            document.getElementById('background-select').value = settings.background;
            previewBackground(settings.background);
        }
        
        // 应用字体大小
        if (settings.fontSize) {
            const fontSizeRange = document.getElementById('font-size');
            const fontSizeValue = document.getElementById('font-size-value');
            fontSizeRange.value = settings.fontSize;
            fontSizeValue.textContent = `${settings.fontSize}px`;
            document.documentElement.style.setProperty('--font-size-base', `${settings.fontSize}px`);
        }
        
        // 应用时间显示
        if (settings.showTime !== undefined) {
            const timeDisplayToggle = document.getElementById('time-display-toggle');
            timeDisplayToggle.checked = settings.showTime;
            
            if (!settings.showTime) {
                const timeDisplay = document.querySelector('.time-display');
                if (timeDisplay) {
                    timeDisplay.style.display = 'none';
                    document.querySelector('.container').style.marginLeft = '0';
                }
            }
        }
    } catch (error) {
        console.error('加载设置失败:', error);
    }
}

/**
 * 加载收藏夹和历史记录
 */
function loadFavoritesAndHistory() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        try {
            favorites = JSON.parse(savedFavorites);
        } catch (error) {
            console.error('加载收藏夹失败:', error);
        }
    }
    
    const savedHistory = localStorage.getItem('visitHistory');
    if (savedHistory) {
        try {
            visitHistory = JSON.parse(savedHistory);
        } catch (error) {
            console.error('加载历史记录失败:', error);
        }
    }
}

/**
 * 加载自定义网站
 */
function loadCustomWebsites() {
    const savedCustomSites = localStorage.getItem('customWebsites');
    if (savedCustomSites) {
        try {
            const customSites = JSON.parse(savedCustomSites);
            
            // 将自定义网站添加到websiteData
            customSites.forEach(site => {
                // 检查是否已存在相同URL的网站
                if (!websiteData.some(existing => existing.url === site.url)) {
                    websiteData.push(site);
                }
            });
            
            console.log('已加载自定义网站:', customSites.length);
        } catch (error) {
            console.error('加载自定义网站失败:', error);
        }
    }
}

/**
 * 加载图标（从本地获取失败时使用线上favicon）
 */
function loadDefaultIcons() {
    websiteData.forEach(site => {
        // 创建图像对象检查本地图标是否存在
        const img = new Image();
        img.onerror = function() {
            // 本地图标不存在，则使用网站favicon
            site.logo = `https://${new URL(site.url).hostname}/favicon.ico`;
        };
        img.src = site.logo;
    });
}

/**
 * 初始化网站列表
 */
function initWebsites(filterCategory = null, searchTerm = "", showFavoriteOnly = false) {
    const navGrid = document.querySelector('.nav-grid');
    navGrid.innerHTML = '';

    let filteredSites = websiteData;
    
    // 只显示收藏
    if (showFavoriteOnly && window.favorites) {
        filteredSites = filteredSites.filter(site => 
            window.favorites.some(fav => fav.url === site.url)
        );
    }
    
    // 应用分类过滤
    if (filterCategory && filterCategory !== "全部") {
        filteredSites = filteredSites.filter(site => site.category === filterCategory);
    }
    
    // 应用搜索过滤
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredSites = filteredSites.filter(site => 
            site.name.toLowerCase().includes(term) || 
            site.category.toLowerCase().includes(term)
        );
    }
    
    // 创建网站卡片
    filteredSites.forEach(site => {
        createWebsiteElement(site, navGrid);
    });
    
    // 无搜索结果时显示提示
    if (filteredSites.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = '未找到匹配的网站';
        navGrid.appendChild(noResults);
    }
    
    // 重新绑定点击事件
    setupNavItemClick();
}

/**
 * 创建网站元素
 */
function createWebsiteElement(site, container) {
    const item = document.createElement('div');
    item.className = 'nav-item';
    item.setAttribute('data-url', site.url);
    item.setAttribute('data-category', site.category);
    
    const img = document.createElement('img');
    img.src = site.logo;
    img.alt = site.name;
    img.onerror = function() {
        // 图标加载失败时使用备选图标
        this.src = 'assets/icons/default.png';
    };
    
    const span = document.createElement('span');
    span.textContent = site.name;
    
    // 添加收藏状态
    if (window.favorites && window.favorites.some(fav => fav.url === site.url)) {
        const favBadge = document.createElement('i');
        favBadge.className = 'fas fa-star favorite-badge';
        favBadge.style.position = 'absolute';
        favBadge.style.top = '10px';
        favBadge.style.right = '10px';
        favBadge.style.color = '#FFD700';
        favBadge.style.fontSize = '0.8rem';
        item.appendChild(favBadge);
    }
    
    // 显示标签（如果有）
    if (site.tags && site.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'site-tags';
        tagsContainer.style.display = 'flex';
        tagsContainer.style.flexWrap = 'wrap';
        tagsContainer.style.gap = '4px';
        tagsContainer.style.marginTop = '8px';
        tagsContainer.style.justifyContent = 'center';
        
        // 只显示最多2个标签
        const visibleTags = site.tags.slice(0, 2);
        
        visibleTags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'site-tag';
            tagSpan.textContent = tag;
            tagSpan.style.fontSize = '0.7rem';
            tagSpan.style.padding = '2px 6px';
            tagSpan.style.backgroundColor = 'rgba(var(--bg-color-rgb), 0.6)';
            tagSpan.style.borderRadius = '10px';
            tagSpan.style.color = 'var(--primary-color)';
            
            tagsContainer.appendChild(tagSpan);
        });
        
        // 显示"更多"指示器
        if (site.tags.length > 2) {
            const moreTag = document.createElement('span');
            moreTag.className = 'site-tag';
            moreTag.textContent = '+' + (site.tags.length - 2);
            moreTag.style.fontSize = '0.7rem';
            moreTag.style.padding = '2px 6px';
            moreTag.style.backgroundColor = 'rgba(var(--bg-color-rgb), 0.6)';
            moreTag.style.borderRadius = '10px';
            moreTag.style.color = 'var(--primary-color)';
            
            tagsContainer.appendChild(moreTag);
        }
        
        item.appendChild(img);
        item.appendChild(span);
        item.appendChild(tagsContainer);
    } else {
        item.appendChild(img);
        item.appendChild(span);
    }
    
    container.appendChild(item);
    return item;
}

/**
 * 初始化分类选择器
 */
function initCategorySelector() {
    const categorySelector = document.querySelector('.category-selector');
    if (!categorySelector) return;
    
    // 获取所有唯一分类
    const categories = ['全部', ...new Set(websiteData.map(site => site.category))];
    
    // 清空现有内容
    categorySelector.innerHTML = '';
    
    // 添加标题（仅在移动端显示）
    const title = document.createElement('h3');
    title.className = 'category-title mobile-only';
    title.textContent = '分类导航';
    title.style.margin = '0 0 15px 0';
    title.style.fontSize = '1.2rem';
    title.style.fontWeight = '500';
    title.style.display = 'none';
    
    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        title.style.display = 'block';
    }
    
    categorySelector.appendChild(title);
    
    // 创建分类按钮
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        
        // 计算该分类下的网站数量
        const count = category === '全部' 
            ? websiteData.length 
            : websiteData.filter(site => site.category === category).length;
        
        // 为每个类别添加相应的图标
        let iconClass = 'fas fa-globe'; // 默认图标
        
        if (category === '全部') {
            iconClass = 'fas fa-th-large';
        } else if (category === '搜索引擎') {
            iconClass = 'fas fa-search';
        } else if (category === '视频') {
            iconClass = 'fas fa-video';
        } else if (category === '社区' || category === '社交') {
            iconClass = 'fas fa-users';
        } else if (category === '购物') {
            iconClass = 'fas fa-shopping-cart';
        } else if (category === '门户') {
            iconClass = 'fas fa-newspaper';
        } else if (category === '开发') {
            iconClass = 'fas fa-code';
        }
        
        // 针对侧边栏的样式 - 始终使用图标和计数
        btn.innerHTML = `
            <i class="${iconClass}"></i>
            <span style="flex: 1;">${category}</span>
            <span class="category-count">${count}</span>
        `;
        
        if (category === '全部') btn.classList.add('active');
        
        btn.addEventListener('click', function() {
            // 更新按钮状态
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 滚动到顶部（针对移动设备）
            if (isMobile) {
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
            
            // 更新网站列表
            const searchTerm = document.querySelector('.search-input')?.value || '';
            initWebsites(category === '全部' ? null : category, searchTerm);
        });
        
        categorySelector.appendChild(btn);
    });
}

/**
 * 初始化移动端分类选择器
 */
function initMobileCategorySelector() {
    const mobileCategorySelector = document.querySelector('.mobile-category-selector');
    if (!mobileCategorySelector) return;
    
    // 获取所有唯一分类
    const categories = ['全部', ...new Set(websiteData.map(site => site.category))];
    
    // 清空现有内容
    mobileCategorySelector.innerHTML = '';
    
    // 创建分类按钮
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        
        // 计算该分类下的网站数量
        const count = category === '全部' 
            ? websiteData.length 
            : websiteData.filter(site => site.category === category).length;
        
        // 为每个类别添加相应的图标
        let iconClass = 'fas fa-globe'; // 默认图标
        
        if (category === '全部') {
            iconClass = 'fas fa-th-large';
        } else if (category === '搜索引擎') {
            iconClass = 'fas fa-search';
        } else if (category === '视频') {
            iconClass = 'fas fa-video';
        } else if (category === '社区' || category === '社交') {
            iconClass = 'fas fa-users';
        } else if (category === '购物') {
            iconClass = 'fas fa-shopping-cart';
        } else if (category === '门户') {
            iconClass = 'fas fa-newspaper';
        } else if (category === '开发') {
            iconClass = 'fas fa-code';
        }
        
        // 移动端分类按钮样式优化 - 紧凑布局
        btn.innerHTML = `
            <i class="${iconClass}"></i>
            ${category}
            <span class="category-count">${count}</span>
        `;
        
        if (category === '全部') btn.classList.add('active');
        
        btn.addEventListener('click', function() {
            // 更新按钮状态
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新网站列表
            const searchTerm = document.querySelector('.search-input')?.value || '';
            initWebsites(category === '全部' ? null : category, searchTerm);
            
            // 自动滚动回顶部
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
        
        mobileCategorySelector.appendChild(btn);
    });
}

/**
 * 设置搜索功能
 */
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        // 搜索按钮点击处理函数
        const handleSearch = function() {
            // 查找活动的分类按钮
            const activeBtn = document.querySelector('.category-btn.active');
            if (!activeBtn) return;
            
            // 获取分类名称（考虑新的按钮结构）
            let category;
            // 检查是否有span子元素（新的侧边栏结构）
            const categorySpan = activeBtn.querySelector('span');
            if (categorySpan) {
                category = categorySpan.textContent.trim();
            } else {
                category = activeBtn.textContent.trim();
            }
            
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // 记录搜索历史
                const searchTitle = `搜索: ${searchTerm}`;
                const searchUrl = `#search?q=${encodeURIComponent(searchTerm)}`;
                
                // 添加到历史记录
                addToHistory(searchUrl, searchTitle);
            }
            
            // 使用清理后的类别和搜索词调用网站初始化
            initWebsites(category === '全部' ? null : category, searchTerm);
        };
        
        // 搜索按钮点击
        searchButton.addEventListener('click', handleSearch);
        
        // 实时搜索延迟处理
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(handleSearch, 500); // 500ms延迟，防止频繁搜索
        });
        
        // 输入框回车
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                clearTimeout(searchTimeout);
                handleSearch();
            }
        });
    }
}

/**
 * 设置夜间模式切换
 */
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // 检查用户偏好
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // 初始化主题
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // 切换主题
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

/**
 * 设置导航项点击事件
 */
function setupNavItemClick() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (!url) return;
            
            // 检查是否是搜索历史记录
            if (url.startsWith('#search?')) {
                // 这是一个搜索历史条目
                const searchParams = new URLSearchParams(url.substring(url.indexOf('?')));
                const searchTerm = searchParams.get('q');
                
                if (searchTerm) {
                    // 设置搜索框的值
                    const searchInput = document.querySelector('.search-input');
                    if (searchInput) {
                        searchInput.value = searchTerm;
                        
                        // 触发搜索
                        const searchButton = document.querySelector('.search-button');
                        if (searchButton) {
                            searchButton.click();
                        }
                    }
                }
            } else {
                // 普通链接，在新窗口中打开
                window.open(url, '_blank');
                
                // 记录访问历史
                addToHistory(url, this.querySelector('span').textContent);
            }
        });
        
        // 添加右键菜单
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            // 如果URL是搜索历史记录，则不添加到收藏夹
            const url = this.getAttribute('data-url');
            if (url && !url.startsWith('#search?')) {
                const name = this.querySelector('span').textContent;
                
                // 检查是否已收藏
                const isFavorited = favorites.some(fav => fav.url === url);
                
                if (isFavorited) {
                    removeFromFavorites(url);
                } else {
                    addToFavorites(url, name);
                }
                
                // 刷新显示
                initWebsites();
            }
        });
    });
}

/**
 * 显示收藏夹
 */
function showFavorites() {
    // 更新显示
    initWebsites(null, "", true);
    
    // 更新分类选择器状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 可以添加一个临时的"收藏夹"按钮
    const categorySelector = document.querySelector('.category-selector');
    const existingFavBtn = document.querySelector('.category-btn.favorites');
    
    if (!existingFavBtn) {
        const favBtn = document.createElement('button');
        favBtn.className = 'category-btn active favorites';
        
        // 检测是否为移动设备
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 计算收藏夹中的网站数量
            const favCount = favorites.length;
            
            favBtn.innerHTML = `
                <i class="fas fa-star" style="margin-right: 10px; color: #FFD700;"></i>
                <span style="flex: 1;">收藏夹</span>
                <span class="category-count" style="background: rgba(0,0,0,0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${favCount}</span>
            `;
        } else {
            favBtn.textContent = '收藏夹';
        }
        
        categorySelector.prepend(favBtn);
        
        favBtn.addEventListener('click', function() {
            showFavorites();
        });
    } else {
        existingFavBtn.classList.add('active');
    }
}

/**
 * 显示历史记录
 */
function showHistory() {
    const navGrid = document.querySelector('.nav-grid');
    navGrid.innerHTML = '';
    
    if (visitHistory.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = '暂无历史记录';
        navGrid.appendChild(noResults);
        return;
    }
    
    visitHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'nav-item';
        historyItem.setAttribute('data-url', item.url);
        
        let logo;
        
        // 处理搜索历史记录
        if (item.url.startsWith('#search?')) {
            // 搜索历史使用特殊图标
            logo = 'assets/icons/search.png';  // 确保此文件存在，或使用其他图标
            // 使用默认搜索图标
            historyItem.innerHTML = `<i class="fas fa-search" style="font-size: 24px; margin-bottom: 10px; color: var(--primary-color);"></i>`;
        } else {
            // 获取网站图标
            const site = websiteData.find(s => s.url === item.url);
            logo = site ? site.logo : `https://${new URL(item.url).hostname}/favicon.ico`;
            
            const img = document.createElement('img');
            img.src = logo;
            img.alt = item.name;
            img.onerror = function() {
                this.src = 'assets/icons/default.png';
            };
            historyItem.appendChild(img);
        }
        
        const span = document.createElement('span');
        span.textContent = item.name;
        
        // 访问时间
        const dateSpan = document.createElement('small');
        dateSpan.textContent = formatDate(new Date(item.date));
        dateSpan.style.display = 'block';
        dateSpan.style.marginTop = '5px';
        dateSpan.style.fontSize = '0.8rem';
        dateSpan.style.color = '#888';
        
        historyItem.appendChild(span);
        historyItem.appendChild(dateSpan);
        navGrid.appendChild(historyItem);
    });
    
    // 更新分类选择器状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 添加临时的"历史记录"按钮
    const categorySelector = document.querySelector('.category-selector');
    const existingHistoryBtn = document.querySelector('.category-btn.history');
    
    if (!existingHistoryBtn) {
        const historyBtn = document.createElement('button');
        historyBtn.className = 'category-btn active history';
        
        // 检测是否为移动设备
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 历史记录数量
            const historyCount = visitHistory.length;
            
            historyBtn.innerHTML = `
                <i class="fas fa-history" style="margin-right: 10px;"></i>
                <span style="flex: 1;">历史记录</span>
                <span class="category-count" style="background: rgba(0,0,0,0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${historyCount}</span>
            `;
        } else {
            historyBtn.textContent = '历史记录';
        }
        
        categorySelector.prepend(historyBtn);
        
        historyBtn.addEventListener('click', function() {
            showHistory();
        });
    } else {
        existingHistoryBtn.classList.add('active');
    }
    
    // 绑定点击事件
    setupNavItemClick();
}

/**
 * 格式化日期
 */
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    
    // 一天内
    if (diff < 86400000) {
        return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // 两天内
    if (diff < 172800000) {
        return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // 一周内
    if (diff < 604800000) {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        return '周' + days[date.getDay()] + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // 更早
    return date.toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

/**
 * 显示添加网站表单
 */
function showAddSiteForm() {
    // 检查是否已有表单
    let addSiteModal = document.getElementById('add-site-modal');
    
    if (!addSiteModal) {
        // 创建模态框
        addSiteModal = document.createElement('div');
        addSiteModal.id = 'add-site-modal';
        addSiteModal.className = 'modal';
        
        // 添加模态框内容
        addSiteModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>添加网站</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="setting-item">
                        <label for="site-name">网站名称</label>
                        <input type="text" id="site-name" placeholder="例如：百度">
                    </div>
                    <div class="setting-item">
                        <label for="site-url">网站地址</label>
                        <input type="url" id="site-url" placeholder="例如：https://www.baidu.com">
                    </div>
                    <div class="setting-item">
                        <label for="site-category">所属分类</label>
                        <select id="site-category">
                            <option value="搜索引擎">搜索引擎</option>
                            <option value="视频">视频</option>
                            <option value="社区">社区</option>
                            <option value="购物">购物</option>
                            <option value="门户">门户</option>
                            <option value="社交">社交</option>
                            <option value="开发">开发</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label for="site-tags">标签（多个标签用逗号分隔）</label>
                        <input type="text" id="site-tags" placeholder="例如：搜索,工具">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-add-site">取消</button>
                    <button class="confirm-add-site">添加</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(addSiteModal);
        
        // 绑定关闭按钮
        const closeBtn = addSiteModal.querySelector('.close-modal');
        const cancelBtn = addSiteModal.querySelector('.cancel-add-site');
        const confirmBtn = addSiteModal.querySelector('.confirm-add-site');
        
        closeBtn.addEventListener('click', function() {
            addSiteModal.classList.remove('active');
        });
        
        cancelBtn.addEventListener('click', function() {
            addSiteModal.classList.remove('active');
        });
        
        confirmBtn.addEventListener('click', function() {
            // 获取表单数据
            const name = document.getElementById('site-name').value.trim();
            const url = document.getElementById('site-url').value.trim();
            const category = document.getElementById('site-category').value;
            const tagsInput = document.getElementById('site-tags').value.trim();
            
            // 简单验证
            if (!name || !url) {
                alert('请填写网站名称和地址');
                return;
            }
            
            // 处理URL格式
            let formattedUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                formattedUrl = 'https://' + url;
            }
            
            // 处理标签
            const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
            
            // 添加网站
            addWebsite(name, formattedUrl, category, null, tags);
            
            // 关闭模态框
            addSiteModal.classList.remove('active');
        });
    }
    
    // 显示模态框
    addSiteModal.classList.add('active');
}

/**
 * 添加新网站
 */
function addWebsite(name, url, category, logo, tags = []) {
    const newSite = {
        name: name,
        url: url,
        category: category || '其他',
        logo: logo || `https://${new URL(url).hostname}/favicon.ico`,
        tags: tags,
        description: ''
    };
    
    websiteData.push(newSite);
    
    // 保存到本地存储
    localStorage.setItem('customWebsites', JSON.stringify(
        websiteData.filter(site => !site.isDefault)
    ));
    
    // 刷新网站列表和分类
    initWebsites();
    initCategorySelector();
}

// 向window暴露函数，供time.js使用
window.initWebsites = initWebsites;
window.setupNavItemClick = setupNavItemClick;

/**
 * 处理窗口大小变化
 */
function handleWindowResize() {
    // 定义一个防抖函数，避免频繁触发
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function() {
        // 是否是移动设备视图
        const isMobileView = window.innerWidth <= 768;
        
        // 重新初始化分类选择器以适应新的屏幕尺寸
        if (isMobileView) {
            initMobileCategorySelector();
        } else {
            initCategorySelector();
        }
        
        // 检查当前是否有活动的分类
        const activeCategory = document.querySelector('.category-btn.active');
        if (activeCategory) {
            // 如果有，重新应用其活动状态
            let category;
            const categorySpan = activeCategory.querySelector('span');
            if (categorySpan && !categorySpan.classList.contains('category-count')) {
                category = categorySpan.textContent.trim();
            } else {
                // 从按钮文本中提取分类名（针对新的移动端按钮）
                const btnText = activeCategory.textContent.trim();
                category = btnText.replace(/\d+$/, '').trim(); // 移除末尾的数字（分类计数）
            }
            
            const searchTerm = document.querySelector('.search-input')?.value || '';
            
            if (activeCategory.classList.contains('favorites')) {
                showFavorites();
            } else if (activeCategory.classList.contains('history')) {
                showHistory();
            } else {
                initWebsites(category === '全部' ? null : category, searchTerm);
            }
        }
    }, 250); // 250ms的延迟
}

/**
 * 添加到收藏夹
 */
function addToFavorites(url, name) {
    if (!favorites.some(fav => fav.url === url)) {
        favorites.push({ url, name, date: new Date().toISOString() });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // 刷新显示
        const activeCategory = document.querySelector('.category-btn.active');
        if (activeCategory && activeCategory.classList.contains('favorites')) {
            showFavorites();
        } else {
            initWebsites();
        }
    }
}

/**
 * 从收藏夹移除
 */
function removeFromFavorites(url) {
    favorites = favorites.filter(fav => fav.url !== url);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // 刷新显示
    const activeCategory = document.querySelector('.category-btn.active');
    if (activeCategory && activeCategory.classList.contains('favorites')) {
        showFavorites();
    } else {
        initWebsites();
    }
}

/**
 * 添加到访问历史
 */
function addToHistory(url, name) {
    // 移除相同URL的旧记录
    visitHistory = visitHistory.filter(item => item.url !== url);
    
    // 添加新记录到开头
    visitHistory.unshift({ url, name, date: new Date().toISOString() });
    
    // 限制历史记录最大数量为50
    if (visitHistory.length > 50) {
        visitHistory = visitHistory.slice(0, 50);
    }
    
    // 保存到本地存储
    localStorage.setItem('visitHistory', JSON.stringify(visitHistory));
}

/**
 * 加载历史记录
 */
function loadVisitHistory() {
    const savedHistory = localStorage.getItem('visitHistory');
    if (savedHistory) {
        try {
            visitHistory = JSON.parse(savedHistory);
        } catch (error) {
            console.error('加载历史记录失败:', error);
        }
    }
}

/**
 * 处理搜索操作
 */
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const navGrid = document.querySelector('.nav-grid');
    
    if (!searchTerm) {
        // 如果搜索框为空，则显示当前分类的所有站点
        initWebsites();
        return;
    }
    
    // 清空网格
    navGrid.innerHTML = '';
    
    // 确定当前选中的分类
    let categoryName = 'all';
    const activeBtn = document.querySelector('.category-btn.active');
    if (activeBtn) {
        // 获取分类名称，考虑到按钮可能包含图标和计数元素
        const span = activeBtn.querySelector('span');
        if (span) {
            categoryName = span.textContent.trim();
        } else {
            categoryName = activeBtn.textContent.trim();
        }
    }
    
    // 根据类别筛选网站
    let filteredSites = websiteData;
    if (categoryName !== 'all' && categoryName !== '全部') {
        filteredSites = websiteData.filter(site => site.category === categoryName);
    }
    
    // 根据搜索词过滤网站，增加了对标签的搜索支持
    const resultSites = filteredSites.filter(site => 
        site.name.toLowerCase().includes(searchTerm) || 
        site.url.toLowerCase().includes(searchTerm) ||
        (site.description && site.description.toLowerCase().includes(searchTerm)) ||
        (site.tags && Array.isArray(site.tags) && site.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm)
        ))
    );
    
    if (resultSites.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = '没有找到匹配的网站';
        navGrid.appendChild(noResults);
    } else {
        // 创建并添加网站元素
        resultSites.forEach(site => {
            createWebsiteElement(site, navGrid);
        });
    }
    
    // 添加搜索记录到历史
    if (searchTerm) {
        const searchTitle = `搜索: ${searchTerm}`;
        const searchUrl = `#search?q=${encodeURIComponent(searchTerm)}`;
        addToHistory(searchUrl, searchTitle);
    }
    
    // 为新生成的元素绑定点击事件
    setupNavItemClick();
} 
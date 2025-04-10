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
    
    // 加载图标
    loadDefaultIcons();
    
    // 初始化网站列表
    initWebsites();
    
    // 初始化分类选择器
    initCategorySelector();
    
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
    
    // 个人页面按钮 (原收藏夹按钮)
    const profileBtn = document.querySelector('.favorites-btn');
    if (profileBtn) {
        // 更新图标和提示
        profileBtn.innerHTML = '<i class="fas fa-user"></i>';
        profileBtn.setAttribute('aria-label', '个人页面');
        
        profileBtn.addEventListener('click', function() {
            showProfilePage();
        });
    }
    
    // 历史记录按钮
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            showHistory();
        });
    }
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
        
        item.appendChild(img);
        item.appendChild(span);
        navGrid.appendChild(item);
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
 * 初始化分类选择器
 */
function initCategorySelector() {
    const categorySelector = document.querySelector('.category-selector');
    if (!categorySelector) return;
    
    // 获取所有唯一分类
    const categories = ['全部', ...new Set(websiteData.map(site => site.category))];
    
    // 创建分类按钮
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        if (category === '全部') btn.classList.add('active');
        
        btn.addEventListener('click', function() {
            // 更新按钮状态
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新网站列表
            const searchTerm = document.querySelector('.search-input')?.value || '';
            initWebsites(category === '全部' ? null : category, searchTerm);
        });
        
        categorySelector.appendChild(btn);
    });
}

/**
 * 设置搜索功能
 */
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        // 搜索按钮点击
        searchButton.addEventListener('click', function() {
            const activeCategory = document.querySelector('.category-btn.active')?.textContent;
            initWebsites(activeCategory === '全部' ? null : activeCategory, searchInput.value);
        });
        
        // 输入框实时搜索
        searchInput.addEventListener('input', function() {
            const activeCategory = document.querySelector('.category-btn.active')?.textContent;
            initWebsites(activeCategory === '全部' ? null : activeCategory, searchInput.value);
        });
        
        // 输入框回车
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
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
            if (url) {
                // 在新窗口中打开链接
                window.open(url, '_blank');
                
                // 记录访问历史 (如果time.js已加载)
                if (window.addToHistory) {
                    window.addToHistory(url, this.querySelector('span').textContent);
                }
            }
        });
        
        // 添加右键菜单
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            if (window.addToFavorites && window.removeFromFavorites && window.favorites) {
                const url = this.getAttribute('data-url');
                const name = this.querySelector('span').textContent;
                
                // 检查是否已收藏
                const isFavorited = window.favorites.some(fav => fav.url === url);
                
                if (isFavorited) {
                    window.removeFromFavorites(url);
                } else {
                    window.addToFavorites(url, name);
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
        favBtn.textContent = '收藏夹';
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
        
        // 获取图标
        const site = websiteData.find(s => s.url === item.url);
        const logo = site ? site.logo : `https://${new URL(item.url).hostname}/favicon.ico`;
        
        const img = document.createElement('img');
        img.src = logo;
        img.alt = item.name;
        img.onerror = function() {
            this.src = 'assets/icons/default.png';
        };
        
        const span = document.createElement('span');
        span.textContent = item.name;
        
        // 访问时间
        const dateSpan = document.createElement('small');
        dateSpan.textContent = formatDate(new Date(item.date));
        dateSpan.style.display = 'block';
        dateSpan.style.marginTop = '5px';
        dateSpan.style.fontSize = '0.8rem';
        dateSpan.style.color = '#888';
        
        historyItem.appendChild(img);
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
        historyBtn.textContent = '历史记录';
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
 * 添加新网站
 */
function addWebsite(name, url, category, logo) {
    const newSite = {
        name: name,
        url: url,
        category: category || '其他',
        logo: logo || `https://${new URL(url).hostname}/favicon.ico`
    };
    
    websiteData.push(newSite);
    
    // 刷新网站列表和分类
    initWebsites();
    initCategorySelector();
}

// 向window暴露函数，供time.js使用
window.initWebsites = initWebsites;
window.setupNavItemClick = setupNavItemClick; 
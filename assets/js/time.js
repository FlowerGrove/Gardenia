/**
 * 时间显示和设置功能模块
 */

// 站点启动时间
const startTime = new Date();

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化时间显示
    initTimeDisplay();
    
    // 初始化功能按钮
    setupActionButtons();
    
    // 初始化设置
    loadSettings();
    
    // 加载收藏夹和历史记录
    loadFavoritesAndHistory();
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

// 收藏夹存储
let favorites = [];

// 网站访问历史
let visitHistory = [];

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
    
    // 收藏夹按钮
    const favoritesBtn = document.querySelector('.favorites-btn');
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', function() {
            showFavorites();
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
 * 添加到收藏夹
 */
function addToFavorites(url, name) {
    if (!favorites.some(fav => fav.url === url)) {
        favorites.push({ url, name, date: new Date().toISOString() });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

/**
 * 从收藏夹移除
 */
function removeFromFavorites(url) {
    favorites = favorites.filter(fav => fav.url !== url);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

/**
 * 添加到历史记录
 */
function addToHistory(url, name) {
    // 移除旧的相同记录
    visitHistory = visitHistory.filter(item => item.url !== url);
    
    // 添加到开头
    visitHistory.unshift({ 
        url, 
        name, 
        date: new Date().toISOString() 
    });
    
    // 限制历史记录数量
    if (visitHistory.length > 50) {
        visitHistory = visitHistory.slice(0, 50);
    }
    
    localStorage.setItem('visitHistory', JSON.stringify(visitHistory));
}

/**
 * 显示收藏夹
 */
function showFavorites() {
    // 更新显示
    window.initWebsites(null, "", true);
    
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
        const site = window.websiteData.find(s => s.url === item.url) || {};
        const logo = site.logo || `https://${new URL(item.url).hostname}/favicon.ico`;
        
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
    window.setupNavItemClick();
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

// 向原有的script.js脚本公开必要的函数
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.addToHistory = addToHistory;
window.favorites = favorites; 
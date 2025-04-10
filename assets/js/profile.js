/**
 * 个人页面功能
 */

/**
 * 显示个人页面
 */
function showProfilePage() {
    const navGrid = document.querySelector('.nav-grid');
    navGrid.innerHTML = '';
    
    // 创建个人页面容器
    const profileContainer = document.createElement('div');
    profileContainer.className = 'profile-container';
    
    // 创建个人页面头部
    const profileHeader = document.createElement('div');
    profileHeader.className = 'profile-header';
    
    // 头像
    const avatar = document.createElement('div');
    avatar.className = 'profile-avatar';
    avatar.innerHTML = '<i class="fas fa-user"></i>';
    
    // 个人信息
    const info = document.createElement('div');
    info.className = 'profile-info';
    
    // 获取并显示用户设备信息
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const deviceType = /mobile|android|iphone|ipad|ipod/i.test(userAgent) ? '移动设备' : '桌面设备';
    
    // 设备信息
    const deviceName = document.createElement('div');
    deviceName.className = 'profile-name';
    deviceName.textContent = `${deviceType} 用户`;
    
    // 用户代理
    const deviceInfo = document.createElement('div');
    deviceInfo.className = 'profile-device';
    deviceInfo.textContent = `${platform}`;
    
    // 上次访问时间
    const lastVisit = document.createElement('div');
    lastVisit.className = 'profile-last-visit';
    const visitDate = localStorage.getItem('lastVisit');
    if (visitDate) {
        lastVisit.textContent = `上次访问: ${formatDate(new Date(visitDate))}`;
    } else {
        lastVisit.textContent = '首次访问';
    }
    
    // 记录本次访问时间
    localStorage.setItem('lastVisit', new Date().toISOString());
    
    // 组装个人信息
    info.appendChild(deviceName);
    info.appendChild(deviceInfo);
    info.appendChild(lastVisit);
    profileHeader.appendChild(avatar);
    profileHeader.appendChild(info);
    
    // 创建内容区域
    const profileBody = document.createElement('div');
    profileBody.className = 'profile-body';
    
    // 统计信息区域
    const statsSection = document.createElement('div');
    statsSection.className = 'profile-section';
    
    const statsTitle = document.createElement('div');
    statsTitle.className = 'profile-section-title';
    statsTitle.innerHTML = '<i class="fas fa-chart-bar"></i> 访问统计';
    
    const statsContent = document.createElement('div');
    statsContent.className = 'profile-section-content';
    
    // 计算统计信息
    const visitCount = visitHistory.length;
    const visitedSites = new Set(visitHistory.map(item => item.url)).size;
    
    // 查找首次访问时间
    let firstVisitDate = new Date();
    if (visitHistory.length > 0) {
        // 按日期排序找出最早的记录
        const sortedHistory = [...visitHistory].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        firstVisitDate = new Date(sortedHistory[0].date);
    }
    
    // 计算访问天数
    const now = new Date();
    const diffTime = Math.abs(now - firstVisitDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const stats = [
        { label: '总访问次数', value: visitCount },
        { label: '访问网站数', value: visitedSites },
        { label: '首次访问', value: formatDate(firstVisitDate) },
        { label: '访问天数', value: diffDays }
    ];
    
    stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.className = 'profile-stat';
        
        const statLabel = document.createElement('div');
        statLabel.className = 'profile-stat-label';
        statLabel.textContent = stat.label;
        
        const statValue = document.createElement('div');
        statValue.className = 'profile-stat-value';
        statValue.textContent = stat.value;
        
        statElement.appendChild(statLabel);
        statElement.appendChild(statValue);
        statsContent.appendChild(statElement);
    });
    
    statsSection.appendChild(statsTitle);
    statsSection.appendChild(statsContent);
    
    // 设置信息区域
    const settingsSection = document.createElement('div');
    settingsSection.className = 'profile-section';
    
    const settingsTitle = document.createElement('div');
    settingsTitle.className = 'profile-section-title';
    settingsTitle.innerHTML = '<i class="fas fa-cog"></i> 设置信息';
    
    const settingsContent = document.createElement('div');
    settingsContent.className = 'profile-section-content';
    
    // 加载保存的设置
    const savedSettings = localStorage.getItem('userSettings');
    const userSettings = savedSettings ? JSON.parse(savedSettings) : {};
    
    // 获取当前主题
    const themeMatch = document.body.className.match(/theme-\w+/);
    const currentTheme = themeMatch ? themeMatch[0].replace('theme-', '') : 'blue';
    
    const settings = [
        { label: '主题颜色', value: currentTheme },
        { label: '字体大小', value: userSettings.fontSize ? `${userSettings.fontSize}px` : '16px' },
        { label: '背景样式', value: userSettings.background || 'default' },
        { label: '夜间模式', value: document.body.classList.contains('dark-mode') ? '开启' : '关闭' }
    ];
    
    settings.forEach(setting => {
        const settingElement = document.createElement('div');
        settingElement.className = 'profile-stat';
        
        const settingLabel = document.createElement('div');
        settingLabel.className = 'profile-stat-label';
        settingLabel.textContent = setting.label;
        
        const settingValue = document.createElement('div');
        settingValue.className = 'profile-stat-value';
        settingValue.textContent = setting.value;
        
        settingElement.appendChild(settingLabel);
        settingElement.appendChild(settingValue);
        settingsContent.appendChild(settingElement);
    });
    
    // 计算浏览器信息
    const browserInfo = getBrowserInfo();
    const browserSection = document.createElement('div');
    browserSection.className = 'profile-section';
    
    const browserTitle = document.createElement('div');
    browserTitle.className = 'profile-section-title';
    browserTitle.innerHTML = '<i class="fas fa-globe"></i> 浏览器信息';
    
    const browserContent = document.createElement('div');
    browserContent.className = 'profile-section-content';
    
    const browserDetails = [
        { label: '浏览器', value: browserInfo.name },
        { label: '版本', value: browserInfo.version },
        { label: '操作系统', value: browserInfo.os },
        { label: '语言', value: navigator.language || navigator.userLanguage }
    ];
    
    browserDetails.forEach(detail => {
        const detailElement = document.createElement('div');
        detailElement.className = 'profile-stat';
        
        const detailLabel = document.createElement('div');
        detailLabel.className = 'profile-stat-label';
        detailLabel.textContent = detail.label;
        
        const detailValue = document.createElement('div');
        detailValue.className = 'profile-stat-value';
        detailValue.textContent = detail.value;
        
        detailElement.appendChild(detailLabel);
        detailElement.appendChild(detailValue);
        browserContent.appendChild(detailElement);
    });
    
    browserSection.appendChild(browserTitle);
    browserSection.appendChild(browserContent);
    
    settingsSection.appendChild(settingsTitle);
    settingsSection.appendChild(settingsContent);
    
    profileBody.appendChild(statsSection);
    profileBody.appendChild(settingsSection);
    profileBody.appendChild(browserSection);
    
    // 添加操作按钮
    const profileActions = document.createElement('div');
    profileActions.className = 'profile-actions';
    
    const clearHistoryBtn = document.createElement('button');
    clearHistoryBtn.className = 'profile-action-btn secondary';
    clearHistoryBtn.textContent = '清除历史记录';
    clearHistoryBtn.addEventListener('click', function() {
        visitHistory = [];
        localStorage.removeItem('visitHistory');
        showProfilePage(); // 刷新个人页面
    });
    
    const backBtn = document.createElement('button');
    backBtn.className = 'profile-action-btn';
    backBtn.textContent = '返回首页';
    backBtn.addEventListener('click', function() {
        initWebsites(); // 返回网站列表
    });
    
    profileActions.appendChild(clearHistoryBtn);
    profileActions.appendChild(backBtn);
    
    // 组装所有元素
    profileContainer.appendChild(profileHeader);
    profileContainer.appendChild(profileBody);
    profileContainer.appendChild(profileActions);
    
    // 添加到页面
    navGrid.appendChild(profileContainer);
    
    // 更新分类选择器状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 添加临时的"个人"按钮
    const categorySelector = document.querySelector('.category-selector');
    if (categorySelector) {
        const existingProfileBtn = document.querySelector('.category-btn.profile');
        
        if (!existingProfileBtn) {
            const profileCatBtn = document.createElement('button');
            profileCatBtn.className = 'category-btn active profile';
            profileCatBtn.textContent = '个人页面';
            categorySelector.prepend(profileCatBtn);
            
            profileCatBtn.addEventListener('click', function() {
                showProfilePage();
            });
        } else {
            existingProfileBtn.classList.add('active');
        }
    }
}

/**
 * 获取浏览器信息
 */
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "未知浏览器";
    let browserVersion = "";
    let os = "未知操作系统";
    
    // 检测操作系统
    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    else if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
    else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    else if (userAgent.indexOf("Android") !== -1) os = "Android";
    else if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) os = "iOS";
    
    // 检测浏览器
    if (userAgent.indexOf("Edge") !== -1) {
        browserName = "Edge";
        browserVersion = userAgent.match(/Edge\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("Firefox") !== -1) {
        browserName = "Firefox";
        browserVersion = userAgent.match(/Firefox\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("Chrome") !== -1) {
        browserName = "Chrome";
        browserVersion = userAgent.match(/Chrome\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("Safari") !== -1) {
        browserName = "Safari";
        browserVersion = userAgent.match(/Safari\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident") !== -1) {
        browserName = "Internet Explorer";
        browserVersion = userAgent.match(/(?:MSIE |rv:)([\d.]+)/)[1];
    }
    
    return {
        name: browserName,
        version: browserVersion,
        os: os
    };
}

// 向window暴露函数
window.showProfilePage = showProfilePage; 
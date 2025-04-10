/**
 * 时间控制器模块 - 管理时间显示功能
 */

// 固定的起始时间 - 2024年10月14日下午2:00
const FIXED_START_TIME = new Date('2024-10-14T14:00:00');
// 当前运行会话的开始时间
let sessionStartTime = new Date();

// 时间控制器设置
let timeSettings = {
    floatingTime: true,
    // 时间相关设置
    firstStartTime: null,
    lastVisitTime: null,
    floatingTimeSize: null,
    // 主题设置
    theme: 'theme-blue'
};

// 浮动时间窗口位置
let floatingTimePosition = { x: null, y: null };

// DOM 元素
let floatingTimeEl;

// 拖动相关变量
let isDragging = false;
let startX, startY, startLeft, startTop;

// 页面加载后初始化
document.addEventListener("DOMContentLoaded", () => {
    initTimeDisplay();
    initFloatingTime();
    loadTimeSettings();
    setupListeners();
});

/**
 * 初始化时间显示
 */
function initTimeDisplay() {
    // 显示当前时间
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

/**
 * 更新当前时间显示
 */
function updateCurrentTime() {
    const now = new Date();
    
    // 使用2020-2-2形式显示日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const weekday = weekdays[now.getDay()];
    const dateString = `${year}-${month}-${day} ${weekday}`;
    
    // 时间字符串
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // 计算运行时间
    const diff = now - FIXED_START_TIME;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const runHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    const runMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const runSeconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
    const runtimeString = `${days}天 ${runHours}:${runMinutes}:${runSeconds}`;
    
    // 只更新侧边栏时间（如果存在）
    const currentTimeElement = document.querySelector('.current-time');
    if (currentTimeElement) {
        currentTimeElement.innerHTML = `
            <div class="time-date">${dateString}</div>
            <div class="time-clock">${timeString}</div>
        `;
    }
    
    // 更新浮动时间窗口
    const floatingTimeContent = document.querySelector('.floating-current-time');
    if (floatingTimeContent) {
        // 如果秒数变化，添加动画效果
        const shouldAnimate = floatingTimeContent.querySelector('.time-seconds')?.textContent !== seconds;
        
        floatingTimeContent.innerHTML = `
            <div class="time-date">${dateString}</div>
            <div class="time-clock">
                <span class="time-hours-minutes">${hours}:${minutes}</span><span class="time-seconds ${shouldAnimate ? 'animate-pop' : ''}">${seconds}</span>
            </div>
            <div class="floating-runtime">
                <span class="runtime-label">已运行</span>
                <span class="runtime-value">${runtimeString}</span>
            </div>
        `;
    }
    
    // 保存最后访问时间（每5分钟一次）
    if (seconds === 0 && minutes % 5 === 0) {
        // 保存最后访问时间
        timeSettings.lastVisitTime = now.toISOString();
        saveTimeSettings();
    }
}

/**
 * 初始化浮动时间窗口
 */
function initFloatingTime() {
    floatingTimeEl = document.querySelector('.floating-time');
    const timeToggleBtn = document.querySelector('.floating-time-toggle-btn');
    
    // 默认显示浮动时间窗口
    timeSettings.floatingTime = true;
    
    // 如果设置里禁用了浮动时间，则隐藏窗口并显示按钮
    if (!timeSettings.floatingTime) {
        floatingTimeEl.classList.add('hidden');
        timeToggleBtn.classList.remove('hidden');
    } else {
        floatingTimeEl.classList.remove('hidden');
        timeToggleBtn.classList.add('hidden');
    }
    
    // 设置打开浮动时间窗口按钮的点击事件
    timeToggleBtn.addEventListener('click', () => {
        floatingTimeEl.classList.remove('hidden');
        timeToggleBtn.classList.add('hidden');
        timeSettings.floatingTime = true;
        document.getElementById('floating-time-toggle').checked = true;
        saveTimeSettings();
    });
    
    // 加载保存的位置，或者设置默认位置
    if (floatingTimePosition.x !== null && floatingTimePosition.y !== null) {
        floatingTimeEl.style.left = floatingTimePosition.x + 'px';
        floatingTimeEl.style.top = floatingTimePosition.y + 'px';
        floatingTimeEl.style.right = 'auto';
    } else {
        // 设置默认位置在右上角
        floatingTimeEl.style.right = '20px';
        floatingTimeEl.style.top = '20px';
        floatingTimeEl.style.left = 'auto';
    }
    
    // 添加鼠标悬停时的动画类
    floatingTimeEl.addEventListener('mouseenter', () => {
        floatingTimeEl.classList.add('hover-effect');
    });
    
    floatingTimeEl.addEventListener('mouseleave', () => {
        floatingTimeEl.classList.remove('hover-effect');
    });
    
    // 添加双击事件显示更多信息
    floatingTimeEl.addEventListener('dblclick', (e) => {
        // 如果点击的是关闭按钮，则不执行
        if (e.target.closest('.close-floating-time')) return;
        
        // 切换显示更多信息
        floatingTimeEl.classList.toggle('expanded');
        
        // 如果展开，则显示更多信息
        if (floatingTimeEl.classList.contains('expanded')) {
            const expandedInfo = document.createElement('div');
            expandedInfo.className = 'expanded-info';
            
            // 从FIXED_START_TIME到现在的总运行天数
            const now = new Date();
            const diff = now - FIXED_START_TIME;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            // 获取上次访问时间
            let lastVisit = '首次访问';
            if (timeSettings.lastVisitTime) {
                const lastVisitDate = new Date(timeSettings.lastVisitTime);
                lastVisit = `${lastVisitDate.getFullYear()}-${lastVisitDate.getMonth()+1}-${lastVisitDate.getDate()} ${lastVisitDate.getHours().toString().padStart(2, '0')}:${lastVisitDate.getMinutes().toString().padStart(2, '0')}`;
            }
            
            expandedInfo.innerHTML = `
                <div class="expanded-row"><span>站点运行</span><span>${days}天</span></div>
                <div class="expanded-row"><span>上次访问</span><span>${lastVisit}</span></div>
            `;
            
            const existingExpandedInfo = floatingTimeEl.querySelector('.expanded-info');
            if (existingExpandedInfo) {
                existingExpandedInfo.parentNode.replaceChild(expandedInfo, existingExpandedInfo);
            } else {
                floatingTimeEl.querySelector('.floating-time-content').appendChild(expandedInfo);
            }
        } else {
            // 如果折叠，则移除额外信息
            const expandedInfo = floatingTimeEl.querySelector('.expanded-info');
            if (expandedInfo) {
                expandedInfo.remove();
            }
        }
    });
    
    // 启用拖拽功能
    enableDrag(floatingTimeEl);
    
    // 添加尺寸调整按钮
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.innerHTML = '<i class="fas fa-grip-lines-vertical"></i>';
    floatingTimeEl.appendChild(resizeHandle);
    
    // 实现尺寸调整功能
    let isResizing = false;
    let originalWidth, originalHeight, startX, startY;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        originalWidth = floatingTimeEl.offsetWidth;
        originalHeight = floatingTimeEl.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
        
        document.addEventListener('mousemove', resizeMove);
        document.addEventListener('mouseup', resizeStop);
    });
    
    function resizeMove(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newWidth = Math.max(150, originalWidth + deltaX);
        const newHeight = Math.max(100, originalHeight + deltaY);
        
        floatingTimeEl.style.width = newWidth + 'px';
        floatingTimeEl.style.height = newHeight + 'px';
        
        // 保存尺寸设置
        timeSettings.floatingTimeSize = {
            width: newWidth,
            height: newHeight
        };
        saveTimeSettings();
    }
    
    function resizeStop() {
        isResizing = false;
        document.removeEventListener('mousemove', resizeMove);
        document.removeEventListener('mouseup', resizeStop);
    }
    
    // 应用保存的尺寸设置
    if (timeSettings.floatingTimeSize) {
        floatingTimeEl.style.width = timeSettings.floatingTimeSize.width + 'px';
        floatingTimeEl.style.height = timeSettings.floatingTimeSize.height + 'px';
    }
}

/**
 * 启用元素拖拽
 * @param {HTMLElement} element - 要拖拽的元素
 */
function enableDrag(element) {
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag, { passive: false });
    
    function startDrag(e) {
        // 如果点击的是关闭按钮，则不拖动
        if (e.target.closest('.close-floating-time')) return;
        
        e.preventDefault();
        
        isDragging = true;
        
        // 获取鼠标/触摸位置
        if (e.type === 'mousedown') {
            startX = e.clientX;
            startY = e.clientY;
        } else {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
        
        // 获取元素当前位置
        const rect = element.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        // 添加移动和释放事件监听
        document.addEventListener('mousemove', moveElement);
        document.addEventListener('touchmove', moveElement, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }
    
    function moveElement(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        let currentX, currentY;
        
        if (e.type === 'mousemove') {
            currentX = e.clientX;
            currentY = e.clientY;
        } else {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }
        
        // 计算新位置
        let newLeft = startLeft + (currentX - startX);
        let newTop = startTop + (currentY - startY);
        
        // 边界检查
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;
        
        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(0, Math.min(newTop, maxY));
        
        // 应用新位置
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        
        // 保存位置到设置
        floatingTimePosition.x = newLeft;
        floatingTimePosition.y = newTop;
        saveTimeSettings();
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', moveElement);
        document.removeEventListener('touchmove', moveElement);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

/**
 * 设置事件监听器
 */
function setupListeners() {
    // 关闭浮动时间窗口的按钮
    document.querySelector('.close-floating-time').addEventListener('click', () => {
        const timeToggleBtn = document.querySelector('.floating-time-toggle-btn');
        floatingTimeEl.classList.add('hidden');
        timeToggleBtn.classList.remove('hidden');
        timeSettings.floatingTime = false;
        document.getElementById('floating-time-toggle').checked = false;
        saveTimeSettings();
    });
    
    // 设置按钮保存按钮
    document.querySelector('.save-settings').addEventListener('click', () => {
        const floatingTimeToggle = document.getElementById('floating-time-toggle');
        const themeSelect = document.getElementById('theme-select');
        const timeToggleBtn = document.querySelector('.floating-time-toggle-btn');
        
        // 应用浮动时间窗口设置
        timeSettings.floatingTime = floatingTimeToggle.checked;
        if (timeSettings.floatingTime) {
            floatingTimeEl.classList.remove('hidden');
            timeToggleBtn.classList.add('hidden');
        } else {
            floatingTimeEl.classList.add('hidden');
            timeToggleBtn.classList.remove('hidden');
        }
        
        // 应用主题设置
        if (themeSelect) {
            timeSettings.theme = themeSelect.value;
            applyTheme(timeSettings.theme);
        }
        
        saveTimeSettings();
        closeModal('settings-modal');
    });
    
    // 设置按钮打开模态框
    document.querySelector('.settings-btn').addEventListener('click', () => {
        openModal('settings-modal');
    });
    
    // 模态框关闭按钮
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // 点击模态框背景关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // 页面关闭前保存数据
    window.addEventListener('beforeunload', () => {
        const now = new Date();
        timeSettings.lastVisitTime = now.toISOString();
        saveTimeSettings();
    });
    
    // 主题选择器变化事件
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            applyTheme(this.value);
        });
    }
}

/**
 * 应用主题
 * @param {string} theme - 主题名称
 */
function applyTheme(theme) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
    document.body.classList.add(theme);
}

/**
 * 打开模态框
 * @param {string} modalId - 模态框ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 如果是设置模态框，更新设置控件的状态
        if (modalId === 'settings-modal') {
            document.getElementById('floating-time-toggle').checked = timeSettings.floatingTime;
            
            // 设置主题选择器的当前值
            const themeSelect = document.getElementById('theme-select');
            if (themeSelect && timeSettings.theme) {
                themeSelect.value = timeSettings.theme;
            }
        }
        
        modal.classList.add('active');
    }
}

/**
 * 关闭模态框
 * @param {string} modalId - 模态框ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * 保存时间设置到本地存储
 */
function saveTimeSettings() {
    const settingsData = {
        // 时间显示设置
        floatingTime: timeSettings.floatingTime,
        floatingTimePosition: floatingTimePosition,
        floatingTimeSize: timeSettings.floatingTimeSize,
        
        // 主题设置
        theme: timeSettings.theme,
        
        // 运行时间相关
        firstStartTime: timeSettings.firstStartTime,
        lastVisitTime: timeSettings.lastVisitTime
    };
    
    localStorage.setItem('timeControllerSettings', JSON.stringify(settingsData));
}

/**
 * 从本地存储加载时间设置
 */
function loadTimeSettings() {
    const savedSettings = localStorage.getItem('timeControllerSettings');
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            
            // 加载时间显示设置
            timeSettings.floatingTime = parsed.floatingTime !== undefined ? parsed.floatingTime : true;
            floatingTimePosition = parsed.floatingTimePosition || { x: null, y: null };
            timeSettings.floatingTimeSize = parsed.floatingTimeSize || null;
            
            // 加载主题设置
            if (parsed.theme) {
                timeSettings.theme = parsed.theme;
                applyTheme(timeSettings.theme);
            }
            
            // 加载运行时间数据
            if (parsed.firstStartTime) {
                timeSettings.firstStartTime = parsed.firstStartTime;
            } else {
                // 设置为固定开始时间
                timeSettings.firstStartTime = FIXED_START_TIME.toISOString();
            }
            
            timeSettings.lastVisitTime = parsed.lastVisitTime || new Date().toISOString();
            
            // 应用设置
            const timeToggleBtn = document.querySelector('.floating-time-toggle-btn');
            if (!timeSettings.floatingTime && floatingTimeEl) {
                floatingTimeEl.classList.add('hidden');
                timeToggleBtn.classList.remove('hidden');
            } else {
                floatingTimeEl.classList.remove('hidden');
                timeToggleBtn.classList.add('hidden');
            }
            
            console.log('成功加载时间设置');
        } catch (error) {
            console.error('加载时间设置失败:', error);
        }
    } else {
        console.log('未找到保存的时间设置，使用默认设置');
        // 设置为固定开始时间
        timeSettings.firstStartTime = FIXED_START_TIME.toISOString();
        saveTimeSettings();
    }
}

// 允许在控制台中检查时间
window.timeController = {
    getRuntime: () => {
        const now = new Date();
        const diff = now - FIXED_START_TIME;
        
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
            firstStart: timeSettings.firstStartTime,
            lastVisit: timeSettings.lastVisitTime
        };
    }
}; 
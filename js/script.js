/**
 * 切换侧边栏菜单的显示状态
 * 控制侧边栏的打开和关闭，同时管理按钮容器的显示状态
 */
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const buttonContainer = document.getElementById('button-container');

    sidebar.classList.toggle('active');

    // 根据侧边栏状态控制按钮容器的显示
    buttonContainer.style.display = sidebar.classList.contains('active') ? 'none' : 'block';
}

// 点击页面任意位置关闭侧边栏菜单
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const buttonContainer = document.getElementById('button-container');
    const dropdowns = document.querySelectorAll('.dropdown-list');

    // 如果点击的不是下拉菜单区域，关闭所有下拉菜单
    if (!event.target.closest('.dropdown-container')) {
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }

    if (sidebar.classList.contains('active') && 
        !buttonContainer.contains(event.target) && 
        !sidebar.contains(event.target)) {
        toggleMenu();
    }
});

/**
 * 打开图片预览模态框
 * @param {HTMLImageElement} img - 被点击的图片元素
 */
function openModal(img) {
    const modal = document.getElementById("modal");
    const expandedImg = document.getElementById("expandedImg");
    modal.style.display = "flex";
    expandedImg.src = img.src;
}

/**
 * 关闭图片预览模态框
 */
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// 监听ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

/**
 * 切换下拉菜单的显示状态
 * @param {HTMLElement} dropdownButton - 被点击的下拉菜单按钮
 */
function toggleDropdown(dropdownButton) {
    const container = dropdownButton.closest('.dropdown-container');
    const dropdownList = container.querySelector('.dropdown-list');
    const arrow = container.querySelector('.arrow');
    
    // 关闭其他打开的下拉菜单
    document.querySelectorAll('.dropdown-list').forEach(list => {
        if (list !== dropdownList) {
            list.style.display = 'none';
            list.closest('.dropdown-container').querySelector('.arrow').style.transform = 'rotate(0deg)';
        }
    });
    
    // 切换当前下拉菜单
    const isVisible = dropdownList.style.display === 'block';
    dropdownList.style.display = isVisible ? 'none' : 'block';
    arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
}

/**
 * 处理菜单项点击事件
 * @param {string} pageName - 页面名称
 */
function handleMenuClick(pageName) {
    // 已经完成的页面列表
    const completedPages = {
        '花卉图鉴': false,
        '养护手册': false,
        '花语大全': false,
        '园艺工具': false,
        '札记': true,
        '余': true,
        '其他': true,
        '杂记': true,
        '工具': true
    };
    
    // 页面对应的URL
    const pageUrls = {
        '札记': 'cardlist.html',
        '余': 'yu0.html',
        '杂记': 'index.html',
        '工具': 'tool.html'
    };
    
    // 如果页面有对应的URL，则直接跳转
    if (pageUrls[pageName]) {
        window.location.href = pageUrls[pageName];
        return false;
    }
    
    // 对于未完成的页面显示提示
    if (!completedPages[pageName]) {
        showError();
        return false;
    }
    
    return true;
}

/**
 * 显示未开发功能提示
 */
function showError() {
    alert("该功能正在开发中，敬请期待！");
}

// 分页相关变量
let currentPage = 1;
const cardsPerPage = 10;
const totalCards = document.querySelectorAll('.card').length;

/**
 * 显示当前页的卡片
 * 根据当前页码显示对应的卡片，并更新分页按钮状态
 */
function showCards() {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.display = (index >= start && index < end) ? 'flex' : 'none';
    });

    // 更新分页按钮状态
    document.getElementById('prevButton').disabled = currentPage === 1;
    document.getElementById('nextButton').disabled = currentPage === Math.ceil(totalCards / cardsPerPage);
}

/**
 * 显示下一页的卡片
 */
function nextPage() {
    if (currentPage < Math.ceil(totalCards / cardsPerPage)) {
        currentPage++;
        showCards();
    }
}

/**
 * 显示上一页的卡片
 */
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showCards();
    }
}

// 初始化显示第一页卡片
showCards();

/**
 * 切换工具网格的显示状态
 * @param {HTMLElement} button - 被点击的工具按钮
 */
function toggleToolsGrid(button) {
    const container = button.closest('.tools-container');
    const toolsGrid = container.querySelector('.tools-grid');
    const arrow = container.querySelector('.arrow');
    
    // 关闭其他打开的下拉菜单和工具网格
    document.querySelectorAll('.dropdown-list, .tools-grid').forEach(element => {
        if (element !== toolsGrid) {
            element.style.display = 'none';
            const parentArrow = element.parentElement.querySelector('.arrow');
            if (parentArrow) {
                parentArrow.style.transform = 'rotate(0deg)';
            }
        }
    });
    
    // 切换当前工具网格
    const isVisible = toolsGrid.style.display === 'grid';
    toolsGrid.style.display = isVisible ? 'none' : 'grid';
    arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
}

// 点击页面任意位置关闭工具网格
document.addEventListener('click', function(event) {
    if (!event.target.closest('.tools-container')) {
        document.querySelectorAll('.tools-grid').forEach(grid => {
            grid.style.display = 'none';
            const arrow = grid.parentElement.querySelector('.arrow');
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    }
});
  










 
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const buttonContainer = document.getElementById('button-container');

    sidebar.classList.toggle('active');
    content.classList.toggle('active');

    // 判断侧边栏是否处于激活状态
    if (sidebar.classList.contains('active')) {
        // 如果侧边栏打开，隐藏按钮
        buttonContainer.style.display = 'none';
    } else {
        // 如果侧边栏关闭，显示按钮
        buttonContainer.style.display = 'block';
    }
}

// 点击内容区域关闭菜单
document.getElementById('content').addEventListener('click', function(e) {
    if(document.getElementById('sidebar').classList.contains('active')) {
        toggleMenu();
    }
});
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



// 打开模态框
function openModal(img) {
    console.log(img.src);
    const modal = document.getElementById("modal");
    const expandedImg = document.getElementById("expandedImg");
    modal.style.display = "flex";
    expandedImg.src = img.src;
}

// 关闭模态框
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// 点击ESC键关闭
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
})



const dropdownContainers = document.querySelectorAll('.dropdown-container');

dropdownContainers.forEach(container => {
    const dropdown = container.querySelector('.dropdown');
    const dropdownList = container.querySelector('.dropdown-list');

    dropdown.addEventListener('click', () => {
        dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
        dropdown.classList.toggle('active');
    });
});
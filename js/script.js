
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const buttonContainer = document.getElementById('button-container');

    sidebar.classList.toggle('active');

    // 判断侧边栏是否处于激活状态
    if (sidebar.classList.contains('active')) {
        // 如果侧边栏打开，隐藏按钮
        buttonContainer.style.display = 'none';
    } else {
        // 如果侧边栏关闭，显示按钮
        buttonContainer.style.display = 'block';
    }
}
//侧边栏
// 点击任意位置关闭菜单
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const buttonContainer = document.getElementById('button-container');
    const content = document.getElementById('content');

    // 如果侧边栏处于激活状态，并且点击的位置不是按钮容器和侧边栏本身，则关闭侧边栏
    if (sidebar.classList.contains('active') && 
        !buttonContainer.contains(e.target) && 
        !sidebar.contains(e.target)) {
        toggleMenu();
    }
});




//图片放大
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


//菜单下拉列表
const dropdownContainers = document.querySelectorAll('.dropdown-container');
dropdownContainers.forEach(container => {
    const dropdown = container.querySelector('.dropdown');
    const dropdownList = container.querySelector('.dropdown-list');

    dropdown.addEventListener('click', () => {
        dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
        dropdown.classList.toggle('active');
    });
});





//上一页下一页
let currentPage = 1;
const cardsPerPage = 5;
const totalCards = document.querySelectorAll('.card').length;

function showCards() {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    document.querySelectorAll('.card').forEach((card, index) => {
        if (index >= start && index < end) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    // 更新按钮状态
    document.getElementById('prevButton').disabled = currentPage === 1;
    document.getElementById('nextButton').disabled = currentPage === Math.ceil(totalCards / cardsPerPage);
}

function nextPage() {
    if (currentPage < Math.ceil(totalCards / cardsPerPage)) {
        currentPage++;
        showCards();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showCards();
    }
}

// 初始化
showCards();













 

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



 // 音乐播放控制
 let currentAudio = null;

 function togglePlay(audioId) {
     const audio = document.getElementById(audioId);
     const button = audio.previousElementSibling;

     if (currentAudio && currentAudio !== audio) {
         currentAudio.pause();
         currentAudio.previousElementSibling.innerHTML = '▶ 播放';
     }

     if (audio.paused) {
         audio.play();
         button.innerHTML = '⏸ 暂停';
         currentAudio = audio;
     } else {
         audio.pause();
         button.innerHTML = '▶ 播放';
         currentAudio = null;
     }
 }
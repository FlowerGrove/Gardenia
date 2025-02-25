
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





let currentAudio = null;

// 获取音频元素并设置事件监听
const audio = document.getElementById('song');
const playButton = document.querySelector('.play-btn');

// 监听 canplay 事件，尝试自动播放
audio.addEventListener('canplay', () => {
    console.log("音频已加载足够数据，可以开始播放！");
    // 尝试自动播放
    audio.play().catch(err => {
        // console.error("自动播放失败，需要用户交互才能播放：", err);
        // 提示用户手动播放
        playButton.innerHTML = '<span>▶</span> 播放';
        alert("自动播放被阻止，请点击播放按钮手动播放。");
    });
});

// 如果音频加载失败（例如文件路径错误或被浏览器阻止）
audio.addEventListener('error', () => {
    console.error("音频加载失败，请检查音频文件路径或网络连接。");
    playButton.innerHTML = '<span>❌</span> 加载失败';
});

function togglePlay(audioId) {
    const audio = document.getElementById(audioId);
    const button = audio.previousElementSibling;

    // 如果当前有音频正在播放且不是当前点击的音频
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.previousElementSibling.innerHTML = '<span>▶</span> 播放';
    }

    // 判断当前音频是否暂停
    if (audio.paused) {
        audio.play().catch(err => {
            console.error("播放失败：", err);
            alert("播放失败，请检查音频文件或网络连接。");
        });
        button.innerHTML = '<span>⏸</span> 暂停';
        currentAudio = audio;
    } else {
        audio.pause();
        button.innerHTML = '<span>▶</span> 播放';
        currentAudio = null;
    }
}





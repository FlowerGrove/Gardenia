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
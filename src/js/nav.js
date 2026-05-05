const items = document.querySelectorAll(".nav-item");

items.forEach(item => {
    item.addEventListener("click", () => {
        document.querySelector(".nav-item.active")?.classList.remove("active");
        item.classList.add("active");
    });
});
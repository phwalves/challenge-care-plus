const items = document.querySelectorAll(".nav-item");

const pageByPath = {
    "index.html": "home",
    "agendar.html": "agendar",
    "historico.html": "historico",
    "pontos.html": "pontos",
    "perfil.html": "perfil",
};

const pathByNav = {
    home: "index.html",
    agendar: "agendar.html",
    historico: "historico.html",
    pontos: "pontos.html",
    perfil: "perfil.html",
};

const currentPage = location.pathname.split("/").pop() || "index.html";
const activeItem = pageByPath[currentPage] || localStorage.getItem("activeNav");

if (activeItem) {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
        item.removeAttribute("aria-current");

        if (item.dataset.nav === activeItem) {
            item.classList.add("active");
            item.setAttribute("aria-current", "page");
        }
    });

    localStorage.setItem("activeNav", activeItem);
}

items.forEach(item => {
    item.addEventListener("click", (event) => {
        const targetPath = pathByNav[item.dataset.nav];

        if (targetPath && item.tagName !== "A") {
            event.preventDefault();
        }

        document.querySelector(".nav-item.active")
            ?.classList.remove("active");
        document.querySelector(".nav-item[aria-current='page']")
            ?.removeAttribute("aria-current");

        item.classList.add("active");
        item.setAttribute("aria-current", "page");

        localStorage.setItem("activeNav", item.dataset.nav);

        if (targetPath && item.tagName !== "A") {
            window.location.href = targetPath;
        }
    });
});

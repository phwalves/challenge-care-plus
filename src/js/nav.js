const items = document.querySelectorAll(".nav-item");
const btnAgendar = document.querySelector("#button-agendar");
const btnHistorico = document.querySelector("#button-historico");
const btnPontos = document.querySelector("#button-pontos");
const btnPerfil = document.querySelector("#button-perfil");

const pageByPath = {
    "agendar.html": "agendar",
    "historico.html": "historico",
    "pontos.html": "pontos",
    "perfil.html": "pefil",
    "index.html": "agendar",
};

const currentPage = location.pathname.split("/").pop() || "index.html";
const activeItem = pageByPath[currentPage] || localStorage.getItem("activeNav");

if (activeItem) {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");

        if (item.dataset.nav === activeItem) {
            item.classList.add("active");
        }
    });

    localStorage.setItem("activeNav", activeItem);
}

items.forEach(item => {
    item.addEventListener("click", () => {

        document.querySelector(".nav-item.active")
            ?.classList.remove("active");

        item.classList.add("active");

        localStorage.setItem("activeNav", item.dataset.nav);
    });
});

btnAgendar?.addEventListener('click', () => {
    btnAgendar.classList.remove('ativo');
    window.location.href = 'agendar.html';
})

btnHistorico?.addEventListener('click', () => {
    btnHistorico.classList.remove('ativo');
    window.location.href = 'historico.html';
})

btnPontos?.addEventListener('click', () => {
    btnPontos.classList.remove('ativo');
    window.location.href = 'pontos.html';
})

btnPerfil?.addEventListener('click', () => {
    btnPerfil.classList.remove('ativo');
    window.location.href = 'perfil.html';
})

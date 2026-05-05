const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();

const months = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];

function renderCalendar(date) {
    calendar.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const today = new Date();

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    weekDays.forEach(day => {
        const el = document.createElement("div");
        el.classList.add("day", "header");
        el.textContent = day;
        calendar.appendChild(el);
    });

    for (let i = firstDay; i > 0; i--) {
        const el = document.createElement("div");
        el.classList.add("day", "inactive");
        el.textContent = prevLastDate - i + 1;
        calendar.appendChild(el);
    }

    for (let i = 1; i <= lastDate; i++) {
        const el = document.createElement("div");
        el.classList.add("day");
        el.textContent = i;

        if (
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            el.classList.add("today");
        }

        calendar.appendChild(el);
    }
}

prevBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
};

nextBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
};

renderCalendar(currentDate);
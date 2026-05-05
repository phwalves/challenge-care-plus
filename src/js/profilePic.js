const seed = Math.floor(Math.random() * 70);
const img = `https://i.pravatar.cc/600?img=${seed}`;

const el = document.getElementById("profile");

el.style.backgroundImage = `
linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0)),
url(${img})
`;
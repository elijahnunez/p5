const bounceTrigger = document.getElementById("bouncingFaces");
let imagesBouncing = false;

const imageSrcs = [
  "assets/Img/Bad Bunny.png",
  "assets/Img/Tego.png",
  "assets/Img/Mariposa.png"
];

let bouncers = [];
let intervals = [];

bounceTrigger.addEventListener("click", () => {
  if (imagesBouncing) return; // prevent duplicates
  imagesBouncing = true;

  for (let i = 0; i < 6; i++) {
    const img = document.createElement("img");
    img.src = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
    img.classList.add("bouncer");

    let x = Math.random() * (window.innerWidth - 100);
    let y = Math.random() * (window.innerHeight - 100);
    let dx = 2 + Math.random() * 2;
    let dy = 2 + Math.random() * 2;

    img.style.position = "absolute";
    img.style.width = "180px";
    img.style.left = x + "px";
    img.style.top = y + "px";
    document.body.appendChild(img);
    bouncers.push(img);

    const interval = setInterval(() => {
      x += dx;
      y += dy;

      if (x <= 0 || x >= window.innerWidth - 100) dx *= -1;
      if (y <= 0 || y >= window.innerHeight - 100) dy *= -1;

      img.style.left = x + "px";
      img.style.top = y + "px";
    }, 16);

    intervals.push(interval);
  }
});


const openButton = document.getElementById('openPopup');
const popupContainer = document.getElementById('popupContainer');
const popupContent = document.querySelector('.popup-content');
const closeButton = document.querySelector('.close-button');

openButton.addEventListener('click', () => {
  popupContainer.classList.add('show');
  popupContent.classList.add('show');
});

closeButton.addEventListener('click', () => {
  popupContainer.classList.remove('show');
  popupContent.classList.remove('show');
});
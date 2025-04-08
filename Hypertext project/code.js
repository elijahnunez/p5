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
// Функция для отмены стандартного действия события
function preventDefaultClick(event) {
  event.preventDefault();
}

// Функция для сохранения пути к изображению в локальном хранилище
function saveSelectedPictureToLocalStorage() {
  var currentPictureSrc = document.getElementById("current-picture").src;
  localStorage.setItem("selectedPictureSrc", currentPictureSrc);
  
  // Обновляем изображение в меню сразу после сохранения
  var smallMenuImage = document.querySelector(".fixed-dropdown-container img");
  smallMenuImage.src = currentPictureSrc;
}

// Функция для загрузки пути к изображению из локального хранилища
function loadSelectedPictureFromLocalStorage() {
  var selectedPictureSrc = localStorage.getItem("selectedPictureSrc");
  if (selectedPictureSrc) {
    var smallMenuImage = document.querySelector(".fixed-dropdown-container img");
    smallMenuImage.src = selectedPictureSrc;
    document.getElementById("current-picture").src = selectedPictureSrc; // Добавляем эту строку
  }
}

// Обработчик события DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
  // Получаем ссылку на кнопку "New picture..."
  var newPictureBtn = document.getElementById("new-picture-btn");

  // Добавляем обработчик события для клика на кнопку "New picture..."
  newPictureBtn.addEventListener("click", function() {
    // Получаем ссылку на модальное окно
    var pictureModal = document.getElementById("picture-modal");

    // Показываем модальное окно
    pictureModal.style.display = "block";
  });

  // Получаем все элементы картинок-вариантов
  var imageOptions = document.querySelectorAll(".image-option");

  // Перебираем каждый элемент и добавляем обработчик события клика
  imageOptions.forEach(function(option) {
    option.addEventListener("click", function() {
      var imgSrc = option.src;
      var currentPicture = document.getElementById("current-picture");
      currentPicture.src = imgSrc;
    });
  });

  // При загрузке страницы пытаемся загрузить выбранное изображение из локального хранилища
  loadSelectedPictureFromLocalStorage();

  // Обработчик кнопки сохранения
  document.getElementById("save-picture-btn").onclick = function() {
    saveSelectedPictureToLocalStorage();
  };
});

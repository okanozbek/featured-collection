const productsArea = document.querySelector('.js-daily-products');

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    let productsHTML = "";
    data.products.forEach(product => {
      let colorsHTML = "";

      product.colors.forEach((color, key) => {
        colorsHTML += `<input type="radio" id="product-${product.id}-color-${key}" name="product-${product.id}-color" style="--bg-color: ${color}">`;
      });

      productsHTML += `
        <div class="carousel-item">
          <div class="daily__product">
            <div class="daily__product--image">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="daily__product--title">
              <a href="${product.link}">${product.name}</a>
            </div>
            <div class="daily__product--body">
              <div class="daily__product--price">
                ${data.currency}${product.price}
              </div>
              <div class="daily__product--color-variants">
                ${colorsHTML}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    productsArea.innerHTML = productsHTML;

    carousel()
  })
  .catch(error => {
    console.error(error.message);
});


const carousel = () => {
  const carousel = document.querySelector('.carousel');
  const carouselInner = document.querySelector('.carousel-inner');
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');
  const carouselItems = document.querySelectorAll('.carousel-item');

  let currentIndex = 0;
  let slideWidth = carouselItems[0].clientWidth;

  // touch event'leri
  let touchStartX = 0;
  let touchEndX = 0;
  let touchThreshold = slideWidth / 2; // kaydırma eşiği, yarım slayt genişliği kadar

  carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
  });

  carousel.addEventListener('touchmove', (event) => {
    event.preventDefault();
    touchEndX = event.touches[0].clientX;
  });

  carousel.addEventListener('touchend', () => {
    const touchDistance = touchEndX - touchStartX;
    if (touchDistance > touchThreshold && currentIndex > 0) {
      prevSlide();
    } else if (touchDistance < -touchThreshold && currentIndex < carouselItems.length - 1) {
      nextSlide();
    }
  });

  // mouse event'leri
  let mouseStartX = 0;
  let mouseEndX = 0;
  carousel.addEventListener('mousedown', (event) => {
    mouseStartX = event.clientX;
  });

  carousel.addEventListener('mousemove', (event) => {
    event.preventDefault();
    mouseEndX = event.clientX;
  });

  carousel.addEventListener('mouseup', () => {
    if (mouseEndX < mouseStartX) {
      nextSlide();
    } else if (mouseEndX > mouseStartX) {
      prevSlide();
    }
  });

  function nextSlide() {
    if (currentIndex < carouselItems.length - 1) {
      currentIndex++;
      carouselInner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      prevButton.classList.remove('hidden');
    }

    if (currentIndex === carouselItems.length - 1) {
      nextButton.classList.add('hidden');
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      carouselInner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      nextButton.classList.remove('hidden');
    }
    
    if (currentIndex === 0) {
      prevButton.classList.add('hidden');
    }
  }

  prevButton.addEventListener('click', prevSlide);
  nextButton.addEventListener('click', nextSlide);
}

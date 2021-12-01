// Модуль - Slider
// Документация - TODO: ссылка на документаю в гитхаб

const slider = document.querySelector('.slider');
const wrapper = slider.querySelector('.slider__wrapper');
const sliderItems = slider.querySelector('.slider__list');
const prev = slider.querySelector('.slider__button--prev');
const next = slider.querySelector('.slider__button--next');
const tabs = slider.querySelector('.slider__tabs');

const slide = (wrapper, items, prev, next, tabs) => {
  let posX1 = 0,
    posX2 = 0,
    posInitial,
    posFinal;
  const threshold = 100;
  const slides = items.querySelectorAll('.slider__item');
  const tabsItems = tabs.querySelectorAll('.slider__tab');
  const slidesLength = slides.length;
  const slideSize = items.offsetWidth / (slidesLength + 2);
  const firstSlide = slides[0];
  const lastSlide = slides[slidesLength - 1]
  const cloneFirst = firstSlide.cloneNode(true);
  const cloneLast = lastSlide.cloneNode(true);

  let index = 0;
  let allowShift = true;

  const dragStart = (e) =>  {
    e = e || window.event;
    posInitial = items.offsetLeft;

    if (e.type === 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  const dragAction = (e) => {
    e = e || window.event;

    if (e.type === 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    items.style.left = (items.offsetLeft - posX2) + "px";
  }

  const dragEnd = (e) => {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, 'drag');
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, 'drag');
    } else {
      items.style.left = (posInitial) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

  const shiftSlide = (dir, action) => {
    items.classList.add('shifting');

    if (allowShift) {
      if (!action) { posInitial = items.offsetLeft; }

      if (dir > 0) {
        items.style.left = (posInitial - slideSize * dir) + "px";
        tabsItems[index].classList.remove('slider__tab--active');
        index = index + dir;
        index > slidesLength - 1
          ? tabsItems[0].classList.add('slider__tab--active')
          : tabsItems[index].classList.add('slider__tab--active');
      } else if (dir < 0) {
        items.style.left = (posInitial + slideSize * -dir) + "px";
        tabsItems[index].classList.remove('slider__tab--active');
        index = index + dir;
        index < 0
          ? tabsItems[slidesLength - 1].classList.add('slider__tab--active')
          : tabsItems[index].classList.add('slider__tab--active');
      }
    };
    allowShift = false;
  }

  const checkIndex = () => {
    items.classList.remove('shifting');

    if (index === -1) {
      items.style.left = -(slidesLength * slideSize) + "px";
      index = slidesLength - 1;
    }

    if (index === slidesLength) {
      items.style.left = -(slideSize) + "px";
      index = 0;
    }

    allowShift = true;
  }

  // Clone first and last slide
  items.appendChild(cloneFirst);
  items.insertBefore(cloneLast, firstSlide);
  wrapper.classList.add('loaded');

  // Mouse events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);

  // Click events
  prev.addEventListener('click', () => shiftSlide(-1));
  next.addEventListener('click', () => shiftSlide(1));
  tabsItems.forEach((item) => item.addEventListener('click', (evt) => {
    const newIndex = [...tabsItems].indexOf(evt.target);
    if (newIndex === index) {
      return;
    }
    const dir = newIndex > index ? newIndex - index : -(index - newIndex);
    shiftSlide(dir);
  }));

  // Transition events
  items.addEventListener('transitionend', checkIndex);
}

slide(wrapper, sliderItems, prev, next, tabs);

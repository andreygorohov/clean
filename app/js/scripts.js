AOS.init();

const header = document.querySelector('.header'),
    places = document.querySelectorAll('.header-btns__btn'),
    heroOrder = document.querySelector('.hero-order'),
    heroOtrderBtn = document.querySelector('.hero-order__btn'),
    clean = document.querySelector('.clean'),
    cleanWrap = document.querySelector('.clean__wrap'),
    cleanSwiper = document.querySelector('.clean-slider'),
    cleanList = document.querySelector('.clean-list'),
    listItems = document.querySelectorAll('.clean-list__item'),
    allTooltips = document.querySelectorAll('.tooltip-marker'),
    allSlides = document.querySelectorAll('.swiper-slide');

let scrolled = false;
window.addEventListener('scroll', function () {
    let scroll = window.scrollY;
    // скрываем кнопку
    if (scroll > clean.offsetTop - 300) {
        heroOrder.classList.add('hide');
    } else {
        heroOrder.classList.remove('hide');
    }

    // фиксируем слайдер
    if (scroll > clean.offsetTop - 300 && !cleanSwiper.classList.contains('fix-slider') && !scrolled) {
        cleanWrap.classList.add('bigger-cnt');
        cleanList.classList.add('fix-list');
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
        scrolled = true;
        allSlides[swiper.activeIndex].querySelectorAll('.tooltip-marker').forEach(el => {
            el.classList.add('show');
        });
    } else if (scroll < clean.offsetTop - 300) {
        cleanWrap.classList.remove('bigger-cnt');
        cleanList.classList.remove('fix-list');
        scrolled = false;
    }
    // фиксируем слайдер
    scroll > header.clientHeight && scroll < clean.offsetTop ? header.classList.add('fix') : header.classList.remove('fix');
    scroll > 100 ? heroOrder.classList.add('hero-order--fix') : heroOrder.classList.remove('hero-order--fix');
});


places.forEach(el => {
    el.addEventListener('click', (e) => {
        document.querySelector('.header-btns__btn--active').classList.remove('header-btns__btn--active');
        el.classList.add('header-btns__btn--active');
    });

});

//анимация кнопки
heroOtrderBtn.addEventListener('mousemove', function (e) {
    this.classList.remove('remove-transform');
    this.parentElement.classList.add('hover');
    const posX = e.layerX;
    const posY = e.layerY;
    this.style.transform = `translate(${posX * 0.6}px, ${posY * 0.6}px)`;
    this.querySelector('span').style.transform = `translate(${posX * 0.2}px, ${(posY - 100) * 0.2}px)`;
});

heroOtrderBtn.addEventListener('mouseleave', function (e) {
    this.classList.add('remove-transform');
    this.parentElement.classList.remove('hover')
});
// слайдер
var swiper = new Swiper(".clean-slider", {
    grabCursor: false,
    effect: "creative",
    simulateTouch: false,
    touchRatio: 0,
    creativeEffect: {
        prev: {
            translate: ["-20%", 0, -1],
        },
        next: {
            translate: ["100%", 0, 0],
        },
    },
});


listItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
        swiper.slideTo(i, 1000);
        if (document.querySelector('.clean-list__btn--active')) {
            document.querySelector('.clean-list__btn--active').classList.remove('clean-list__btn--active');
        }
        item.querySelector('button').classList.add('clean-list__btn--active');
    });
});

swiper.on('slideChange', function () {
    allTooltips.forEach(el => {
        el.classList.remove('show');
    });
    allSlides[swiper.activeIndex].querySelectorAll('.tooltip-marker').forEach(el => {
        el.classList.add('show');
    });

});




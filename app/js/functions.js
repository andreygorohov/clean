//burger
function burger(burgerclass, menuClass) {
    const icon = document.querySelector(burgerclass),
        menu = document.querySelector(menuClass);

    icon?.addEventListener('click', function () {
        this.classList.toggle('burger--active');
        menu.classList.toggle('menu--active');
        document.body.classList.toggle('lock');
    });
}

burger('.burger', '.menu');

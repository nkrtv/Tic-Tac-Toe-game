class BurgerMenu {
    constructor(burgerBtnSelector, navSelector, bodySelector) {
        this.burgerMenuBtn = document.querySelector(burgerBtnSelector);
        this.headerNav = document.querySelector(navSelector);
        this.body = document.querySelector(bodySelector);

        // Initialize the event during class creation 
        this.init();
    }

    // Add or remove active class
    toggleMenu() {
        // get object properties using destructuring
        const { burgerMenuBtn, headerNav, body } = this;

        burgerMenuBtn.classList.toggle('active');
        headerNav.classList.toggle('active');
        body.classList.toggle('active');
    }

    // Remove active class
    closeMenu() {
        const { burgerMenuBtn, headerNav, body } = this;

        burgerMenuBtn.classList.remove('active');
        headerNav.classList.remove('active');
        body.classList.remove('active');
    }

    // Add events - "click" to add or remove active class
    init() {
        this.burgerMenuBtn.addEventListener('click', () => this.toggleMenu());
        const navButtons = document.querySelectorAll('.nav__btn');
        navButtons.forEach(button => button.addEventListener('click', () => this.closeMenu()));
    }

}
// Create burger menu
const myBurgerMenu = new BurgerMenu('.header__burger-menu-btn', '.header__nav', 'body');






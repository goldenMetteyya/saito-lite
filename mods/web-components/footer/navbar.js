import { NavBarTemplate ***REMOVED*** from './navbar.template.js';

export const NavBar = {
    render(app) {
        let footer = document.querySelector('.footer');
        footer.innerHTML = NavBarTemplate()
        footer.classList.add('nav-bar')

        this.attachEvents(app);
***REMOVED***,

    attachEvents(app) {
        Array.from(document.getElementsByClassName('nav-button'))
            .forEach(button => button.addEventListener('click', (event) => {
                let buttons = document.getElementsByClassName('nav-button');
                Array.from(buttons).forEach(button => button.style.color = "var(--text-color-normal)");

                let id = event.target.id;
                this.renderScreen(app, id);
                this.updateNavBarButton(id);
        ***REMOVED***
        ));
***REMOVED***,

    renderScreen(app, id) {
        switch (id) {
            case 'chat':
                app.chat.render();
                break;
            case 'arcade':
                app.arcade.render();
                break;
            case 'forum':
                app.forum.render();
                break;
            case 'wallet':
                app.wallet.render();
                break;
            default:
                break;
    ***REMOVED***
***REMOVED***,

    updateNavBarButton(id) {
        let nav_button = document.querySelector(`#${id***REMOVED***.nav-button`);
        nav_button.style.color = "var(--saito-red)";
***REMOVED***
***REMOVED***
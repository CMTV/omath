SITE.Classes.OpenNavButton = class
{
    button;
    lastY;

    constructor()
    {
        this.button = document.querySelector('.nav-open-button');
        this.lastY = scrollY;

        window.addEventListener('scroll', () =>
        {
            if (scrollY === 0)
            {
                this.isHidden(false);
                return;
            }

            this.isHidden(scrollY > this.lastY);
            this.lastY = scrollY;
        });

        ['load', 'resize'].forEach(event =>
        {
            window.addEventListener(event, () =>
            {
                if (scrollY === 0) this.isHidden(false);
            });
        });
    }

    isHidden(hidden)
    {
        this.button.classList.toggle('_hidden', hidden);
    }
}

SITE.Classes.NavPane = class
{
    element;
    name;
    depth;

    constructor(paneElement)
    {
        this.element = paneElement;
        this.name = paneElement.getAttribute('name');
        this.depth = +paneElement.dataset.depth;
    }

    align(position, noAnim = false)
    {
        if (position === 'center') position = 'current';

        ['_current', '_left', '_right'].forEach(pos => this.element.classList.remove(pos));

        if (noAnim)
            this.element.classList.add('_noAnim');

        this.element.classList.add(`_${position}`);
        this.element.offsetHeight;
        this.element.classList.remove('_noAnim');
    }
}

SITE.Classes.Nav = class
{
    element;
    navSwitchers;

    constructor()
    {
        this.element = document.querySelector("nav.menu");
        this.navSwitchers = document.querySelectorAll('[data-nav-switcher]');

        this.navSwitchers.forEach(navSwitcher =>
        {
            navSwitcher.addEventListener('click', () =>
            {
                this.toggleOpened();

                let targetPane = navSwitcher.dataset.navSwitcher;
                if (targetPane)
                    SITE.Navigation.switchPane(targetPane, true);
            });
        });

        document.body.addEventListener("click", e =>
        {
            for (let i = 0; i < this.navSwitchers.length; i++)
                if (this.navSwitchers[i].contains(e.target)) return;

            if (!this.element.contains(e.target)) this.isOpened(false);
        });

        this.element.querySelectorAll('.close-button').forEach(button =>
        {
            button.addEventListener('click', () => { this.close(); });
        });
    }

    open() { this.isOpened(true); }
    close() { this.isOpened(false); }

    toggleOpened() { this.element.classList.toggle('_opened'); }
    isOpened(opened) { this.element.classList.toggle('_opened', opened); }
}

SITE.Classes.NavManager = class
{
    openButton;
    nav;
    panes = { /* paneName : {  paneObject } */ };
    rootPane;

    constructor()
    {
        this.nav = new SITE.Classes.Nav();
        this.openButton = new SITE.Classes.OpenNavButton();

        document.querySelectorAll('nav.menu > .nav-pane').forEach((pane) =>
        {
            pane = new SITE.Classes.NavPane(pane);
            this.panes[pane.name] = pane;

            if (pane.element.dataset.root !== undefined) this.rootPane = pane;
        });
    }

    switchPane(targetPane, forceNoAnim = false)
    {
        targetPane = this.getPane(targetPane);
        targetPane.align('center', forceNoAnim);

        Object.values(this.panes).forEach(pane =>
        {
            if (pane.name !== targetPane.name)
            {
                let noAnim = !pane.element.classList.contains('_current');
                pane.align(targetPane.depth > pane.depth ? 'left' : 'right', noAnim || forceNoAnim);
            }
        });
    }

    switchToRoot()
    {
        this.switchPane(this.rootPane);
    }

    getPane(pane)
    {
        if (typeof pane === 'string')
            return this.panes[pane];
        else if (pane instanceof SITE.Classes.NavPane)
            return pane;
    }
}

window.addEventListener('load', () =>
{
    SITE['Navigation'] = new SITE.Classes.NavManager();
});
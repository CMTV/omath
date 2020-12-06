SITE.Classes.TOC = class
{
    headers;
    tocHeaders = {};
    currentHeader = null;

    constructor()
    {
        let query = '';
        for (let i = 1; i <= 6; i++)
        {
            query += `h${i}[id]`;
            if (i !== 6) query += ',';
        }

        this.headers = document.querySelectorAll(query);

        if (this.headers.length === 0) return;

        this.headers.forEach((elem, i) =>
        {
            let id = elem.getAttribute('id');
            let tocHeader = document.querySelector(`.tree.toc a[href="#${id}"]`);

            if (tocHeader !== null)
                this.tocHeaders[i] = tocHeader;          
        });

        window.addEventListener('resize', () => this.updateActive());
        window.addEventListener('scroll', () => this.updateActive());

        this.updateActive();
    }

    updateActive()
    {
        let left = 0;
        let right = this.headers.length;
        let current = 0;

        while (left < right)
        {
            let middle = ( (left + right) / 2 )|0;
            let middleY = this.headers[middle].getBoundingClientRect().top + scrollY - parseFloat(window.getComputedStyle(this.headers[middle])['margin-top']);

            if (scrollY < middleY)
                right = middle;
            else
            {
                current = middle;
                left = middle + 1;
            }
        }

        this.setActive(current);
    }

    setActive(headerI)
    {
        if (this.tocHeaders[headerI] === undefined) return;

        if (this.currentHeader !== null)
            this.tocHeaders[this.currentHeader].classList.remove('_active');

        this.tocHeaders[headerI].classList.add('_active');
        this.currentHeader = headerI;
    }
}

window.addEventListener('load', () => new SITE.Classes.TOC());
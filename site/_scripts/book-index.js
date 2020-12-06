window.addEventListener('load', () =>
{
    let categories = document.querySelectorAll('.tree.index .indexItem--category');

    categories.forEach(category =>
    {
        category.addEventListener('click', function ()
        {
            this.classList.toggle('_expanded');
        });
    });

    // Opening categories which hold current article

    let currentArticle = document.querySelector('.indexItem--current');

    let catOpenRec = (cursor) =>
    {
        let parent = cursor.parentElement;
        
        let children = parent.children;
        for (let i = 0, child; child = children[i]; i++)
        {
            if (child.classList.contains('indexItem--category'))
            {
                child.classList.add('_expanded');
            }
        }

        if (parent === null) return;
        if (!parent.classList.contains('index'))
            catOpenRec(parent);
    };

    catOpenRec(currentArticle);
});
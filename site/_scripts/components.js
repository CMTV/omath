//
// Expandable Accent Blocks 
//

window.addEventListener('load', () =>
{
    let openButtons = document.querySelectorAll('.accent-block--expandable .side-block:nth-of-type(2)');

    for (let i = 0; i < openButtons.length; i++)
    {
        let button = openButtons[i];

        button.addEventListener('click', function ()
        {
            this.parentElement.parentElement.classList.toggle('_expanded');
        });
    }
});
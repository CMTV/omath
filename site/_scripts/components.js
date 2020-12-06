//
// Theorem 
//

window.addEventListener('load', () =>
{
    let openProofButtons = document.querySelectorAll('.accent-block--theorem .side-block--proof');

    for (let i = 0; i < openProofButtons.length; i++)
    {
        let button = openProofButtons[i];

        button.addEventListener('click', function ()
        {
            this.parentElement.parentElement.classList.toggle('_proof-opened');
        });
    }
});
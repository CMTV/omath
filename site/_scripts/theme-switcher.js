SITE['toggleTheme'] = () =>
{
    let theme = localStorage.getItem('theme');
    let newTheme = (theme === 'light' ? 'dark' : 'light');

    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('theme--dark', newTheme === 'dark');
}
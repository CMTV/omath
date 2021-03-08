SITE['toggleTheme'] = () =>
{
    let theme = localStorage.getItem('theme');
    setTheme((theme === 'dark' ? 'light' : 'dark'));
}
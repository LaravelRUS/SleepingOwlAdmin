Admin.Modules.register('display.theme', () => {

    window.Cookies = require('js-cookie')

    const theme_mode = document.querySelector('#theme-mode')
    const theme_icon = document.querySelector('#theme-icon')

    const setColorMode = (mode) => {
        mode = mode === 'dark' ? 'dark' : 'light'

        if (mode === 'dark') {
            document.body.classList.add('dark-mode')
            document.documentElement.dataset.colorScheme = 'dark'
            theme_icon.className = 'fa-regular fa-lightbulb'
        } else {
            document.body.classList.remove('dark-mode')
            document.documentElement.dataset.colorScheme = 'light'
            theme_icon.className = 'fa-solid fa-moon'
        }

        window.localStorage.setItem('theme-mode', mode)
        Cookies.set('theme-mode', mode)
        theme_mode.setAttribute('data-mode', mode)
    }

    document.querySelector('#theme-mode').addEventListener('click', () => {
        if (theme_mode.getAttribute('data-mode') === 'light') {
            setColorMode('dark')
        } else {
            setColorMode('light')
        }
    });

    setColorMode(window.localStorage.getItem('theme-mode'))
})

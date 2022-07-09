// For all template (except for the old 'default')

document.addEventListener("DOMContentLoaded", function(event) {

    let sidebar = document.getElementById('adminSidebar')

    let sidebarToggleMobile = document.getElementById('sidebar-toggle-mobile')
    let navbarToggleMobile = document.getElementById('navbar-toggle-mobile')
    let navbarToggle = document.getElementById('navbar-toggle')


    // Заглушка для LocalStorage, если куки не работают или не доступны
    if (!Cookies) {
        if (localStorage.getItem('sidebar-state') == 'sidebar-collapse') {
            sidebar.classList.add('collapsed')
        } else {
            sidebar.classList.remove('collapsed')
        }
    }

    //
    navbarToggle.addEventListener('click', function () {
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed')
            localStorage.setItem('sidebar-state', 'sidebar-open')

            if (Cookies) {
                Cookies.set('sidebar-state', 'sidebar-open')
            }
        } else {
            sidebar.classList.add('collapsed')
            localStorage.setItem('sidebar-state', 'sidebar-collapse')

            if (Cookies) {
                Cookies.set('sidebar-state', 'sidebar-collapse')
            }
        }
    })

    sidebarToggleMobile.addEventListener('click', function () {
        if (sidebar.classList.contains('show')) {
            sidebar.classList.remove('show')
        } else {
            sidebar.classList.add('show')
        }
    })

    navbarToggleMobile.addEventListener('click', function () {
        if (sidebar.classList.contains('show')) {
            sidebar.classList.remove('show')
        } else {
            sidebar.classList.add('show')
        }
    })


    // Show sidebar Submenu
    const sidebarSubMenu = document.querySelectorAll(".sidebar-item.is-submenu")

    sidebarSubMenu.forEach(function(elem) {
        elem.querySelector(".toggle-submenu").addEventListener('click', function (e) {
            e.preventDefault()

            if (elem.classList.contains('show')) {
                elem.classList.remove('show')
            } else {
                elem.classList.add('show')
            }
        })
    })

})

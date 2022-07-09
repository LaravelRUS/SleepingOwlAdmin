// For all template (except for the old 'default')

document.addEventListener("DOMContentLoaded", function(event) {

    let clearLocalStorageButton = document.getElementById('clear-local-storage')

    clearLocalStorageButton.addEventListener('click', function () {
        localStorage.clear()
        if (Swal) {
            Admin.Messages.toast(
                'LocalStorage. ' + trans('lang.message.deleted'), '',
                'success', 'top-end',
                'bg-success text-light',
                true
            )
        }
    })

})

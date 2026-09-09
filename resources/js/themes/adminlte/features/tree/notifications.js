export function createLegacyTreeNotifications(swal, messages, labels) {
    assertDependencies(swal, messages)
    const toast = swal.mixin({
        didOpen: bindToastPause(swal),
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
    })

    return {
        error: () => messages.error(labels.error),
        success: () => toast.fire({ icon: 'success', title: labels.success }),
    }
}

function bindToastPause(swal) {
    return (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer)
        toast.addEventListener('mouseleave', swal.resumeTimer)
    }
}

function assertDependencies(swal, messages) {
    if (typeof swal?.mixin !== 'function' || typeof messages?.error !== 'function') {
        throw new TypeError('Legacy tree notifications require SweetAlert and Admin.Messages.')
    }
}

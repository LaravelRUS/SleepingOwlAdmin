export function createTailwindTreeNotifications(labels = {}) {
    const messages = {
        error: labels.error ?? 'Unable to save tree',
        success: labels.success ?? 'Tree order saved',
    }

    return {
        error: (region) => updateRegion(region, 'error', messages.error),
        success: (region) => updateRegion(region, 'success', messages.success),
    }
}

function updateRegion(region, state, message) {
    if (!region) return false

    region.dataset.state = state
    region.hidden = false
    region.setAttribute('role', state === 'error' ? 'alert' : 'status')
    region.textContent = message

    return true
}

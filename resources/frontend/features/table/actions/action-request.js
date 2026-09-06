const SAFE_METHODS = new Set(['GET', 'HEAD'])

export async function executeTableAction({
    callbacks,
    events,
    form,
    http,
    notify,
    reload,
    settings,
    showResult = true,
    timeout = 5000,
}) {
    events.fire('datatables::actions::submitting', settings)

    try {
        const message = await requestJson(http, settings)

        showActionResult(message, notify, showResult, timeout)
        callbacks(message)
        events.fire('datatables::actions::submitted', form)
        reload()

        return message
    } catch (error) {
        events.fire('datatables::actions::failed', error, form)
        throw error
    }
}

export function actionRequestSettings(url, method, parameters) {
    return {
        data: parameters.toString(),
        dataType: 'json',
        type: method || 'POST',
        url,
    }
}

function requestJson(http, settings) {
    const method = String(settings.type || 'POST').toUpperCase()
    const options = { method }
    let url = settings.url

    if (SAFE_METHODS.has(method)) {
        url = appendQuery(url, settings.data)
    } else {
        options.body = settings.data
        options.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    }

    return http.request(url, options).then((response) => response.json())
}

function showActionResult(message, notify, enabled, timeout) {
    if (!enabled || !Object.hasOwn(message, 'text')) {
        return
    }

    notify({
        icon: message.type,
        text: message.message,
        timer: timeout,
        title: message.text,
    })
}

function appendQuery(url, query) {
    if (!query) {
        return url
    }

    return `${url}${url.includes('?') ? '&' : '?'}${query}`
}

export const AUTO_UPDATE_COLOR_PROPERTY = '--soa-datatables-autoupdate-color'

export function mountTableAutoUpdates(host, dependencies) {
    assertTableCollection(dependencies.tables)
    const config = readAutoUpdateConfig(host)
    const controllers = matchingTables(dependencies.tables, config.tableClass).map((table) =>
        mountTableAutoUpdate(table, config, dependencies),
    )

    return {
        destroy() {
            controllers.forEach((controller) => controller.destroy())
        },
    }
}

export function mountTableAutoUpdate(table, config, dependencies) {
    assertDependencies(dependencies)

    const close = createCloseControl(table.ownerDocument, config.closeLabel)
    const bar = createProgressBar(table, config, dependencies.ProgressBar)
    let timer = null
    let stopped = false

    table.classList.add('autoupdater')
    table.style.setProperty(AUTO_UPDATE_COLOR_PROPERTY, config.color)
    table.appendChild(close)

    const schedule = () => {
        bar.animate(1)
        timer = dependencies.scheduler.setTimeout(refresh, config.interval)
    }
    const refresh = () => {
        bar.set(0)
        if (stopped) return

        dependencies.tables.reload(table)
        schedule()
    }
    const destroy = () => {
        if (stopped) return

        stopped = true
        dependencies.scheduler.clearTimeout(timer)
        close.removeEventListener('click', destroy)
        close.remove()
        bar.set(0)
        bar.destroy?.()
        table.classList.remove('autoupdater')
        table.style.removeProperty(AUTO_UPDATE_COLOR_PROPERTY)
    }

    close.addEventListener('click', destroy)
    schedule()

    return { destroy }
}

export function readAutoUpdateConfig(host) {
    const interval = Number(host.dataset.interval)
    const color = host.style.getPropertyValue(AUTO_UPDATE_COLOR_PROPERTY).trim()

    if (!Number.isFinite(interval) || interval < 1) {
        throw new TypeError('Table auto-update interval must be a positive number.')
    }
    if (!color) {
        throw new TypeError('Table auto-update requires a configured color.')
    }

    return {
        closeLabel: host.dataset.closeLabel || 'Stop auto-update',
        color,
        interval,
        tableClass: host.dataset.tableClass || null,
    }
}

function matchingTables(tables, tableClass) {
    return tables
        .all()
        .map((adapter) => adapter.element)
        .filter((table) => !tableClass || table.classList.contains(tableClass))
}

function createCloseControl(document, label) {
    const control = document.createElement('button')
    control.className = 'autoupdater-close'
    control.type = 'button'
    control.setAttribute('aria-label', label)
    control.textContent = '\u00d7'

    return control
}

function createProgressBar(table, config, ProgressBar) {
    return new ProgressBar.Line(table, {
        color: `var(${AUTO_UPDATE_COLOR_PROPERTY})`,
        duration: config.interval,
        strokeWidth: 2,
        svgStyle: null,
    })
}

function assertDependencies({ ProgressBar, scheduler, tables }) {
    if (typeof ProgressBar?.Line !== 'function') {
        throw new TypeError('Table auto-update requires ProgressBar.Line.')
    }
    assertScheduler(scheduler)
    if (typeof tables?.reload !== 'function') {
        throw new TypeError('Table auto-update requires the Admin.Tables registry.')
    }
}

function assertScheduler(scheduler) {
    if (
        typeof scheduler?.setTimeout !== 'function' ||
        typeof scheduler?.clearTimeout !== 'function'
    ) {
        throw new TypeError('Table auto-update requires timer functions.')
    }
}

function assertTableCollection(tables) {
    if (typeof tables?.all !== 'function') {
        throw new TypeError('Table auto-update requires the Admin.Tables collection.')
    }
}

export const AUTO_UPDATE_COLOR_PROPERTY = '--soa-datatables-autoupdate-color'
export const AUTO_UPDATE_FEATURE = 'autoUpdate'

const AUTO_UPDATE_HOST_SELECTOR = '[data-admin-table-autoupdate]'
const CONTROL_TEMPLATE_SELECTOR = 'template[data-admin-table-autoupdate-control]'
const TOGGLE_CONTROL_SELECTOR =
    '[data-admin-table-autoupdate-toggle], [data-admin-table-autoupdate-close]'
const LABEL_SELECTOR = '[data-admin-table-autoupdate-label]'
const PAUSE_ICON_SELECTOR = '[data-admin-table-autoupdate-pause-icon]'
const RESUME_ICON_SELECTOR = '[data-admin-table-autoupdate-resume-icon]'

export function mountTableAutoUpdates(host, dependencies) {
    assertTableCollection(dependencies.tables)

    return new TableAutoUpdateCollection(host, dependencies)
}

export function mountTableAutoUpdate(table, config, dependencies) {
    assertDependencies(dependencies)

    const settings = normalizeMountConfig(config)
    const mounted = mountProgressView(table, settings, dependencies)
    const controller = new TableAutoUpdateController({
        ...mounted,
        now: dependencies.now ?? Date.now,
        scheduler: dependencies.scheduler,
        settings,
        table,
        tables: dependencies.tables,
    })

    return dependencies.deferStart ? controller.startAfterLayout() : controller.start()
}

export function installTableAutoUpdateFeature(engine, dependencies) {
    if (typeof engine?.feature?.register !== 'function') {
        throw new TypeError('Table auto-update requires the DataTables feature registry.')
    }
    assertDependencies(dependencies)

    engine.feature.register(AUTO_UPDATE_FEATURE, (settings) =>
        createTableAutoUpdateFeature(settings, dependencies),
    )
}

export function configureTableAutoUpdate(table, options) {
    const host = findAutoUpdateHost(table)
    if (!host) return false

    const config = readAutoUpdateConfig(host)
    if (!matchesAutoUpdateTable(table, config.tableClasses)) return false

    options.layout = { ...options.layout, top: AUTO_UPDATE_FEATURE }

    return true
}

export function createTableAutoUpdateFeature(settings, dependencies) {
    const table = settings.table
    const host = findAutoUpdateHost(table)
    if (!host) return null

    const config = readAutoUpdateConfig(host)
    if (!matchesAutoUpdateTable(table, config.tableClasses)) return null

    const controller = mountTableAutoUpdate(table, config, {
        ...dependencies,
        controlTemplate: readAutoUpdateControlTemplate(host),
        deferStart: true,
        insert: false,
    })
    const destroy = () => controller.destroy()

    settings.api.one('destroy.soaAutoUpdate', destroy)

    return controller.element
}

class TableAutoUpdateCollection {
    constructor(host, dependencies) {
        this.config = readAutoUpdateConfig(host)
        this.controllers = new Map()
        this.dependencies = {
            ...dependencies,
            controlTemplate: readAutoUpdateControlTemplate(host),
        }
        this.unsubscribe = dependencies.tables.subscribe((event) => this.registryChanged(event))

        try {
            dependencies.tables.all().forEach((adapter) => this.mount(adapter))
        } catch (error) {
            this.destroy()
            throw error
        }
    }

    registryChanged({ adapter, type }) {
        if (type === 'registered') this.mount(adapter)
        if (type === 'unregistered') this.unmount(adapter)
    }

    mount(adapter) {
        const table = adapter.element
        if (!this.matches(table)) return

        const controller = mountTableAutoUpdate(table, this.config, this.dependencies)
        this.controllers.set(table, controller)
    }

    matches(table) {
        return (
            !this.controllers.has(table) &&
            !table.classList.contains('autoupdater') &&
            matchesAutoUpdateTable(table, this.config.tableClasses)
        )
    }

    unmount(adapter) {
        this.controllers.get(adapter.element)?.destroy()
        this.controllers.delete(adapter.element)
    }

    pause() {
        this.controllers.forEach((controller) => controller.pause())
    }

    resume() {
        this.controllers.forEach((controller) => controller.resume())
    }

    destroy() {
        this.unsubscribe()
        this.controllers.forEach((controller) => controller.destroy())
        this.controllers.clear()
    }
}

class TableAutoUpdateController {
    constructor({ bar, now, scheduler, settings, table, tables, view }) {
        this.bar = bar
        this.now = now
        this.scheduler = scheduler
        this.settings = settings
        this.table = table
        this.tables = tables
        this.view = view
        this.deadline = 0
        this.destroyed = false
        this.pendingStart = null
        this._paused = false
        this.remaining = settings.interval
        this.started = false
        this.timer = null
        this.refresh = this.refresh.bind(this)
        this.start = this.start.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    start() {
        if (this.destroyed || this.started) return this

        this.started = true
        this.view.toggle.addEventListener('click', this.toggle)
        this.bar.set(0)
        this.sync()
        this.schedule(this.settings.interval)

        return this
    }

    startAfterLayout() {
        if (this.destroyed || this.started || this.pendingStart) return this

        const pending = {}
        const start = () => {
            if (this.pendingStart === pending) this.pendingStart = null
            this.start()
        }

        this.pendingStart = pending
        if (typeof this.scheduler.requestAnimationFrame === 'function') {
            const frame = this.scheduler.requestAnimationFrame(start)
            pending.cancel = () => this.scheduler.cancelAnimationFrame?.(frame)
        } else {
            const timer = this.scheduler.setTimeout(start, 0)
            pending.cancel = () => this.scheduler.clearTimeout(timer)
        }

        return this
    }

    schedule(delay, resumeProgress = false) {
        this.remaining = delay
        this.deadline = this.now() + delay
        if (resumeProgress && typeof this.bar.resume === 'function') this.bar.resume()
        else this.bar.animate(1, { duration: delay })
        this.timer = this.scheduler.setTimeout(this.refresh, delay)
    }

    refresh() {
        this.timer = null
        this.bar.set(0)
        if (this._paused || this.destroyed) return

        this.tables.reload(this.table)
        this.schedule(this.settings.interval)
    }

    pause() {
        if (this._paused || this.destroyed) return false

        this.remaining = Math.max(0, this.deadline - this.now())
        this.clearTimer()
        if (typeof this.bar.pause === 'function') this.bar.pause()
        else this.bar.stop?.()
        this._paused = true
        this.sync()

        return true
    }

    resume() {
        if (!this._paused || this.destroyed) return false

        this._paused = false
        this.sync()
        if (this.remaining <= 0) this.refresh()
        else this.schedule(this.remaining, true)

        return true
    }

    toggle() {
        return this._paused ? this.resume() : this.pause()
    }

    sync() {
        syncControlState(this.table, this.view, this.settings, this._paused)
    }

    clearTimer() {
        if (this.timer === null) return

        this.scheduler.clearTimeout(this.timer)
        this.timer = null
    }

    destroy() {
        if (this.destroyed) return

        this.destroyed = true
        this.pendingStart?.cancel?.()
        this.pendingStart = null
        this.clearTimer()
        if (this.started) this.view.toggle.removeEventListener('click', this.toggle)
        this.bar.set(0)
        this.bar.destroy?.()
        this.view.root.remove()
        this.table.classList.remove('autoupdater', 'autoupdater-paused')
        this.table.style.removeProperty(AUTO_UPDATE_COLOR_PROPERTY)
    }

    get paused() {
        return this._paused
    }

    get element() {
        return this.view.root
    }
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
        color,
        interval,
        pauseLabel: host.dataset.pauseLabel || host.dataset.closeLabel || 'Pause auto-update',
        resumeLabel: host.dataset.resumeLabel || 'Resume auto-update',
        tableClasses: readTableClasses(host),
    }
}

export function readAutoUpdateControlTemplate(host) {
    const template = host.querySelector?.(CONTROL_TEMPLATE_SELECTOR)
    if (typeof template?.content?.cloneNode !== 'function') {
        throw new TypeError('Table auto-update requires a Blade-rendered control template.')
    }

    return template
}

export function matchesAutoUpdateTable(table, tableClasses) {
    return tableClasses.length === 0 || tableClasses.some((name) => table.classList.contains(name))
}

function readTableClasses(host) {
    const serialized = host.dataset.tableClasses
    if (!serialized) return normalizeTableClasses([host.dataset.tableClass])

    let classes
    try {
        classes = JSON.parse(serialized)
    } catch {
        throw new TypeError('Table auto-update classes must be a JSON array.')
    }

    if (!Array.isArray(classes)) {
        throw new TypeError('Table auto-update classes must be a JSON array.')
    }

    return normalizeTableClasses(classes)
}

function normalizeTableClasses(classes) {
    if (classes.some((name) => name !== undefined && typeof name !== 'string')) {
        throw new TypeError('Table auto-update classes must contain only strings.')
    }

    return [
        ...new Set(
            classes
                .filter(Boolean)
                .flatMap((name) => name.trim().split(/[\s,]+/u))
                .map((name) => name.replace(/^\.+/u, ''))
                .filter(Boolean),
        ),
    ]
}

function normalizeMountConfig(config) {
    return {
        color: config.color,
        interval: config.interval,
        pauseLabel: config.pauseLabel || config.closeLabel || 'Pause auto-update',
        resumeLabel: config.resumeLabel || 'Resume auto-update',
    }
}

function mountProgressView(table, settings, dependencies) {
    const view = cloneControl(dependencies.controlTemplate)

    if (dependencies.insert !== false) insertControlBeforeTable(table, view.root)
    table.classList.add('autoupdater')
    table.style.setProperty(AUTO_UPDATE_COLOR_PROPERTY, settings.color)
    view.root.style?.setProperty(AUTO_UPDATE_COLOR_PROPERTY, settings.color)

    try {
        const bar = createProgressBar(view.root, settings, dependencies.ProgressBar)

        return { bar, view }
    } catch (error) {
        view.root.remove()
        table.classList.remove('autoupdater')
        table.style.removeProperty(AUTO_UPDATE_COLOR_PROPERTY)
        throw error
    }
}

function findAutoUpdateHost(table) {
    return table.ownerDocument?.querySelector?.(AUTO_UPDATE_HOST_SELECTOR) ?? null
}

function cloneControl(template) {
    const fragment = template.content.cloneNode(true)
    const roots = fragment.children ?? []
    if (roots.length !== 1) {
        throw new TypeError('Table auto-update control template requires one root element.')
    }

    const root = fragment.firstElementChild
    const toggle = findToggle(root)
    if (!toggle) {
        throw new TypeError('Table auto-update control template requires a toggle control.')
    }

    return {
        label: findElement(root, LABEL_SELECTOR),
        pauseIcon: findElement(root, PAUSE_ICON_SELECTOR),
        resumeIcon: findElement(root, RESUME_ICON_SELECTOR),
        root,
        toggle,
    }
}

function findToggle(root) {
    if (typeof root.matches === 'function' && root.matches(TOGGLE_CONTROL_SELECTOR)) return root

    return findElement(root, TOGGLE_CONTROL_SELECTOR)
}

function findElement(root, selector) {
    if (typeof root.querySelector !== 'function') return null

    return root.querySelector(selector)
}

function insertControlBeforeTable(table, root) {
    if (typeof table.parentNode?.insertBefore !== 'function') {
        throw new TypeError('Table auto-update requires the table to be attached to the DOM.')
    }

    table.parentNode.insertBefore(root, table)
}

function syncControlState(table, view, config, paused) {
    const label = paused ? config.resumeLabel : config.pauseLabel

    if (paused) table.classList.add('autoupdater-paused')
    else table.classList.remove('autoupdater-paused')
    if (view.root.dataset) view.root.dataset.state = paused ? 'paused' : 'running'
    view.toggle.setAttribute('aria-label', label)
    view.toggle.setAttribute('aria-pressed', String(paused))
    view.toggle.setAttribute('title', label)
    if (view.label) view.label.textContent = label
    if (view.pauseIcon) view.pauseIcon.hidden = paused
    if (view.resumeIcon) view.resumeIcon.hidden = !paused
}

function createProgressBar(container, config, ProgressBar) {
    return new ProgressBar.Line(container, {
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
    if (typeof tables?.all !== 'function' || typeof tables?.subscribe !== 'function') {
        throw new TypeError('Table auto-update requires the Admin.Tables collection.')
    }
}

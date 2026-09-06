export function createWysiwygRegistry(options = {}) {
    const adapters = new Map()
    const records = new Map()
    const events = options.events
    const log = options.log ?? (() => {})

    return {
        add(name, switchOn, switchOff, exec) {
            return this.register(name, switchOn, switchOff, exec)
        },
        destroyAll: () =>
            Promise.all([...records.keys()].map((id) => switchOff(records, id, events, log))),
        editor: (id) => editorFor(records, id),
        exec: (id, command, data) => execute(records, id, command, data, events),
        get: (id) => records.get(id)?.adapter,
        register: (name, on, off, exec) => registerAdapter(adapters, name, on, off, exec, log),
        switchOff: (id) => switchOff(records, id, events, log),
        switchOn: (id, name, params) => switchOn(adapters, records, id, name, params, events, log),
    }
}

function registerAdapter(adapters, name, switchOn, switchOff, exec, log) {
    if (typeof switchOn !== 'function' || typeof switchOff !== 'function') {
        log('System try to add editor without required callbacks.', 'Wysiwyg')
        return false
    }

    adapters.set(name, Object.freeze([name, switchOn, switchOff, exec]))

    return true
}

async function switchOn(adapters, records, id, name, params, events, log) {
    const adapter = adapters.get(name)
    if (!adapter) {
        log(`Unknown WYSIWYG editor [${name}].`, 'Wysiwyg')
        return null
    }

    const active = records.get(id)
    if (active?.adapter === adapter) return active.ready
    if (active) await switchOff(records, id, events, log)

    return activate(records, id, adapter, params, events, log)
}

function activate(records, id, adapter, params, events, log) {
    const record = { adapter, editor: null, ready: null }
    records.set(id, record)
    record.ready = Promise.resolve()
        .then(() => adapter[1](id, params))
        .then(normalizeEditor)
        .then((editor) => editorReady(records, record, id, editor, events))
        .catch((error) => editorFailed(records, record, id, error, log))

    return record.ready
}

function editorReady(records, record, id, editor, events) {
    record.editor = editor
    if (records.get(id) === record) events?.fire?.('wysiwyg:switchOn', editor)

    return editor
}

function editorFailed(records, record, id, error, log) {
    if (records.get(id) === record) records.delete(id)
    log(error, 'Wysiwyg')

    return null
}

async function switchOff(records, id, events, log) {
    const record = records.get(id)
    if (!record) return false
    records.delete(id)

    try {
        const editor = await record.ready
        if (editor) await record.adapter[2](editor, id)
        events?.fire?.('wysiwyg:switchOff', id)
        return true
    } catch (error) {
        log(error, 'Wysiwyg')
        return false
    }
}

function execute(records, id, command, data, events) {
    const record = records.get(id)
    if (typeof record?.adapter?.[3] !== 'function') return undefined

    events?.fire?.('wysiwyg:exec', command, id, data)
    if (record.editor) return record.adapter[3](record.editor, command, id, data)

    return record.ready.then((editor) => {
        if (editor) return record.adapter[3](editor, command, id, data)
    })
}

function editorFor(records, id) {
    const record = records.get(id)

    return record?.editor ?? record?.ready
}

function normalizeEditor(editor) {
    return Array.isArray(editor) ? (editor[0] ?? null) : editor
}

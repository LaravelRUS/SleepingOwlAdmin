const DEFAULT_PREFIX = 'SleepingOwl::'

export class StorageRepository {
    constructor(storage = globalThis.localStorage, prefix = DEFAULT_PREFIX) {
        assertStorage(storage)
        assertPrefix(prefix)
        this.storage = storage
        this.prefix = prefix
    }

    set(key, value) {
        if (isRecord(key)) {
            Object.entries(key).forEach(([name, item]) => this.write(name, item))
            return this
        }

        this.write(key, value)

        return this
    }

    get(key) {
        if (Array.isArray(key)) {
            return Object.fromEntries(key.map((name) => [name, this.read(name)]))
        }

        return this.read(key)
    }

    remove(key) {
        normalizeKeys(key).forEach((name) => this.storage.removeItem(this.storageKey(name)))

        return this
    }

    clear() {
        const keys = this.ownedKeys()
        keys.forEach((key) => this.storage.removeItem(key))

        return keys.length
    }

    read(key) {
        return this.storage.getItem(this.storageKey(key))
    }

    write(key, value) {
        this.storage.setItem(this.storageKey(key), value)
    }

    storageKey(key) {
        assertKey(key)

        return `${this.prefix}${key}`
    }

    ownedKeys() {
        return Array.from({ length: this.storage.length }, (_, index) =>
            this.storage.key(index),
        ).filter((key) => typeof key === 'string' && key.startsWith(this.prefix))
    }
}

export function createStorageRepository(storage, prefix) {
    return new StorageRepository(storage, prefix)
}

function normalizeKeys(key) {
    return Array.isArray(key) ? key : [key]
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function assertStorage(storage) {
    const methods = ['getItem', 'setItem', 'removeItem', 'key']
    if (!storage || methods.some((method) => typeof storage[method] !== 'function')) {
        throw new TypeError('Storage repository requires the Web Storage interface.')
    }
}

function assertPrefix(prefix) {
    if (typeof prefix !== 'string' || prefix.length === 0) {
        throw new TypeError('Storage prefix must be a non-empty string.')
    }
}

function assertKey(key) {
    if (typeof key !== 'string' || key.length === 0) {
        throw new TypeError('Storage key must be a non-empty string.')
    }
}

import { describe, expect, it } from 'vitest'

import {
    createStorageRepository,
    StorageRepository,
} from '../../../../resources/js/core/storage/storage-repository.js'

function memoryStorage(initial = {}) {
    const values = new Map(Object.entries(initial))

    return {
        get length() {
            return values.size
        },
        getItem: (key) => values.get(key) ?? null,
        key: (index) => [...values.keys()][index] ?? null,
        removeItem: (key) => values.delete(key),
        setItem: (key, value) => values.set(key, String(value)),
    }
}

describe('storage repository', () => {
    it('preserves the legacy prefixed scalar/object/array contract without lodash', () => {
        const storage = memoryStorage()
        const repository = createStorageRepository(storage)

        repository.set('page', 2).set({ filter: 'active', scope: 'all' })

        expect(repository.get('page')).toBe('2')
        expect(repository.get(['filter', 'scope'])).toEqual({ filter: 'active', scope: 'all' })
        expect(storage.getItem('SleepingOwl::filter')).toBe('active')
    })

    it('removes requested values and clears only its own namespace', () => {
        const storage = memoryStorage({
            'SleepingOwl::filter': 'active',
            'SleepingOwl::page': '2',
            unrelated: 'keep',
        })
        const repository = new StorageRepository(storage)

        repository.remove('filter')
        expect(repository.clear()).toBe(1)
        expect(storage.getItem('unrelated')).toBe('keep')
        expect(repository.get(['filter', 'page'])).toEqual({ filter: null, page: null })
    })

    it('diagnoses invalid storage, prefixes and keys', () => {
        expect(() => createStorageRepository({})).toThrow('Web Storage interface')
        expect(() => createStorageRepository(memoryStorage(), '')).toThrow('non-empty string')
        expect(() => createStorageRepository(memoryStorage()).get('')).toThrow('non-empty string')
    })
})

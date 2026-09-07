import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

for (const profile of ['development', 'production']) {
    test(`${profile} compatibility runtime preserves core and exposes only legacy services`, async ({
        page,
    }) => {
        await useCompatibilityProfile(page, profile)
        await page.goto('/compatibility-runtime')
        await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
        expect(await inspectCompatibility(page)).toEqual(expectedCompatibility())
    })
}

function inspectCompatibility(page) {
    return page.evaluate(() => ({
        config: globalThis.Admin.Config.get('env'),
        corePreserved: Object.entries(globalThis.__coreServices).every(
            ([name, service]) => globalThis.Admin[name] === service,
        ),
        forbidden: {
            $: typeof globalThis.$,
            AdminLTE: typeof globalThis.AdminLTE,
            DataTable: typeof globalThis.DataTable,
            Vue: typeof globalThis.Vue,
            bootstrap: typeof globalThis.bootstrap,
            jQuery: typeof globalThis.jQuery,
        },
        globals: {
            Swal: typeof globalThis.Swal?.fire,
            axios: typeof globalThis.axios?.request,
            lodash: typeof globalThis._?.get,
            trans: typeof globalThis.trans,
        },
        messageMethods: ['confirm', 'error', 'message', 'prompt', 'success'].every(
            (name) => typeof globalThis.Admin.Messages[name] === 'function',
        ),
        moduleCalls: globalThis.__moduleCalls,
        token: globalThis.Admin.token,
        translation: globalThis.trans('lang.greeting', { name: 'Ada' }),
        url: globalThis.Admin.Url.admin('users', { filter: 'active' }),
        user: {
            authenticated: globalThis.Admin.User.isAuthenticated(),
            id: globalThis.Admin.User.id,
        },
        wysiwygMethods: ['exec', 'get', 'register', 'switchOff', 'switchOn'].every(
            (name) => typeof globalThis.Admin.WYSIWYG[name] === 'function',
        ),
    }))
}

function expectedCompatibility() {
    return {
        config: 'testing',
        corePreserved: true,
        forbidden: {
            $: 'undefined',
            AdminLTE: 'undefined',
            DataTable: 'undefined',
            Vue: 'undefined',
            bootstrap: 'undefined',
            jQuery: 'undefined',
        },
        globals: {
            Swal: 'function',
            axios: 'function',
            lodash: 'function',
            trans: 'function',
        },
        messageMethods: true,
        moduleCalls: ['called'],
        token: 'compatibility-csrf-token',
        translation: 'Hello Ada',
        url: 'http://127.0.0.1:4173/admin/users?filter=active',
        user: { authenticated: true, id: 7 },
        wysiwygMethods: true,
    }
}

async function useCompatibilityProfile(page, profile) {
    if (profile === 'development') return

    await page.route('**/profiles/development/js/shared/compatibility.js', (route) => {
        const requestUrl = new URL(route.request().url())
        const path = '/public/default/profiles/production/js/shared/compatibility.js'

        return route.continue({ url: new URL(path, requestUrl).href })
    })
}

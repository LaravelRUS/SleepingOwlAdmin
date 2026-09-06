import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

async function useProductionBundle(page) {
    const replacements = new Map([
        ['/public/default/js/admin-app-dev.js', '/public/default/js/admin-app.js'],
        ['/public/default/js/vue-dev.js', '/public/default/js/vue.js'],
    ])

    await page.route('**/public/default/js/*-dev.js', (route) => {
        const requestUrl = new URL(route.request().url())
        const replacement = replacements.get(requestUrl.pathname)

        return replacement
            ? route.continue({ url: new URL(replacement, requestUrl).href })
            : route.continue()
    })
}

for (const profile of ['development', 'production']) {
    test(`${profile} runtime mounts a late custom island through the public API`, async ({
        page,
    }) => {
        const warnings = []
        page.on('console', (message) => {
            if (message.type() === 'warning' && message.text().startsWith('[Vue warn]')) {
                warnings.push(message.text())
            }
        })
        if (profile === 'production') await useProductionBundle(page)

        await page.goto('/custom-vue-island')
        await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
        await expect(page.locator('#custom-island-first .custom-counter')).toHaveText(
            'plugin-ready:2',
        )
        await page.locator('#custom-island-first .custom-counter').click()
        await expect(page.locator('#custom-island-first .custom-counter')).toHaveText(
            'plugin-ready:3',
        )

        expect(await inspectRuntime(page)).toEqual({
            appCount: 3,
            globalVue: 'undefined',
            packageAppPreserved: true,
            pluginInstalls: 2,
            rescanCount: 0,
            version: expect.stringMatching(/^3\.5\./),
        })
        await expectPublicLifecycle(page)
        expect(warnings).toEqual([])
    })
}

function inspectRuntime(page) {
    return page.evaluate(() => ({
        appCount: globalThis.Admin.VueApps.size,
        globalVue: typeof globalThis.Vue,
        packageAppPreserved: globalThis.__packageAppPreserved,
        pluginInstalls: globalThis.__customPluginInstalls,
        rescanCount: globalThis.Admin.Vue.scan(globalThis.document),
        version: globalThis.__customRuntimeVersion,
    }))
}

async function expectPublicLifecycle(page) {
    const result = await page.evaluate(() => {
        const host = globalThis.document.querySelector('#custom-island-first')
        const destroyed = globalThis.Admin.Vue.destroy(host)
        const sizeAfterDestroy = globalThis.Admin.VueApps.size
        const mounted = globalThis.Admin.Vue.scan(host)

        return {
            destroyed,
            mounted,
            pluginInstalls: globalThis.__customPluginInstalls,
            sizeAfterDestroy,
        }
    })

    expect(result).toEqual({ destroyed: 1, mounted: 1, pluginInstalls: 3, sizeAfterDestroy: 2 })
    await expect(page.locator('#custom-island-first .custom-counter')).toHaveText('plugin-ready:2')
}

import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

for (const profile of ['development', 'production']) {
    test(`${profile} AdminLTE logical runtime replaces the legacy aggregate`, async ({ page }) => {
        const errors = []
        const requests = []
        page.on('pageerror', (error) => errors.push(error.message))
        page.on('request', (request) => requests.push(new URL(request.url()).pathname))
        await useProfile(page, profile)
        await page.goto('/adminlte-logical-runtime')

        expect(await runtimeState(page)).toEqual(expectedRuntimeState())
        expect(errors).toEqual([])
        expect(requests).not.toContain('/public/default/js/admin-app.js')
        expect(requests).not.toContain('/public/default/js/vue.js')
        expect(requests).not.toContain('/public/default/js/modules.js')

        await page.locator('#runtime-dropdown-toggle').click()
        await expect(page.locator('#runtime-dropdown-toggle')).toHaveAttribute(
            'aria-expanded',
            'true',
        )
        await page.locator('#runtime-tooltip').focus()
        await expect(page.locator('[role="tooltip"]')).toHaveText('Runtime help')
        await page.locator('#runtime-alert-close').click()
        await expect(page.locator('#runtime-alert')).toHaveCount(0)
    })
}

async function useProfile(page, profile) {
    if (profile === 'development') return

    await page.route('**/profiles/development/**', (route) => {
        const requestUrl = new URL(route.request().url())
        const replacement = requestUrl.pathname.replace('/development/', `/${profile}/`)

        return route.continue({ url: new URL(replacement, requestUrl).href })
    })
}

function runtimeState(page) {
    return page.evaluate(() => {
        const table = globalThis.document.getElementById('runtime-table')
        const tree = globalThis.document.getElementById('runtime-tree')

        return {
            customModuleBoots: globalThis.__customModuleBoots,
            features: Object.fromEntries(
                [
                    'Alerts',
                    'Dropdowns',
                    'Forms',
                    'Lightboxes',
                    'Sidebar',
                    'TableFeature',
                    'Tooltips',
                    'Trees',
                    'Vue',
                ].map((name) => [name, typeof globalThis.Admin[name]]),
            ),
            forbidden: Object.fromEntries(
                ['$', 'AdminLTE', 'DataTable', 'Vue', 'bootstrap', 'jQuery'].map((name) => [
                    name,
                    typeof globalThis[name],
                ]),
            ),
            mounted: {
                table: Boolean(globalThis.Admin.Tables.get(table)),
                tree: Boolean(globalThis.Admin.Components.get(tree, 'tree')),
            },
            rescanned: globalThis.Admin.Components.scan(globalThis.document),
        }
    })
}

function expectedRuntimeState() {
    return {
        customModuleBoots: 1,
        features: {
            Alerts: 'object',
            Dropdowns: 'object',
            Forms: 'object',
            Lightboxes: 'object',
            Sidebar: 'object',
            TableFeature: 'object',
            Tooltips: 'object',
            Trees: 'object',
            Vue: 'object',
        },
        forbidden: {
            $: 'undefined',
            AdminLTE: 'undefined',
            DataTable: 'undefined',
            Vue: 'undefined',
            bootstrap: 'undefined',
            jQuery: 'undefined',
        },
        mounted: { table: true, tree: true },
        rescanned: 0,
    }
}

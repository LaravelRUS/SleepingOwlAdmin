import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

for (const profile of ['development', 'production']) {
    test(`${profile} shared features entry auto-boots lightbox on the headless core`, async ({
        page,
    }) => {
        await useSharedFeatures(page, profile)
        await page.goto('/lightboxes')
        await page.locator('#single').click()

        await expect(page.locator('.glightbox-container')).toBeVisible()
        expect(await inspectFeature(page, 'Lightboxes')).toEqual(expectedFeatureState())
    })

    test(`${profile} shared features entry auto-boots tree on the headless core`, async ({
        page,
    }) => {
        await useSharedFeatures(page, profile)
        await page.goto('/trees')

        expect(await inspectFeature(page, 'Trees')).toEqual(expectedFeatureState())
        expect(await mountedTrees(page)).toEqual([true, true])
    })
}

async function useSharedFeatures(page, profile) {
    await replaceScript(
        page,
        '**/public/default/js/admin-core.js',
        profilePath(profile, 'admin-core'),
    )
    await replaceScript(
        page,
        '**/public/default/js/shared/compatibility.js',
        `/public/default/profiles/${profile}/js/shared/compatibility.js`,
    )
    await replaceScript(
        page,
        '**/public/default/js/shared/features.js',
        `/public/default/profiles/${profile}/js/shared/features.js`,
    )
}

function replaceScript(page, pattern, path) {
    return page.route(pattern, (route) => {
        const requestUrl = new URL(route.request().url())

        return route.continue({ url: new URL(path, requestUrl).href })
    })
}

function profilePath(profile) {
    return `/public/default/profiles/${profile}/js/admin-core.js`
}

function inspectFeature(page, namespace) {
    return page.evaluate(
        (name) => ({
            forbidden: {
                $: typeof globalThis.$,
                AdminLTE: typeof globalThis.AdminLTE,
                DataTable: typeof globalThis.DataTable,
                Vue: typeof globalThis.Vue,
                bootstrap: typeof globalThis.bootstrap,
                jQuery: typeof globalThis.jQuery,
            },
            scan: typeof globalThis.Admin[name]?.scan,
        }),
        namespace,
    )
}

function expectedFeatureState() {
    return {
        forbidden: {
            $: 'undefined',
            AdminLTE: 'undefined',
            DataTable: 'undefined',
            Vue: 'undefined',
            bootstrap: 'undefined',
            jQuery: 'undefined',
        },
        scan: 'function',
    }
}

function mountedTrees(page) {
    return page.evaluate(() => {
        return ['tree-primary', 'tree-secondary'].map((id) => {
            const element = globalThis.document.getElementById(id)

            return Boolean(globalThis.Admin.Components.get(element, 'tree'))
        })
    })
}

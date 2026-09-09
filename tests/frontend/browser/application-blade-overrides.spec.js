import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

const profileAssets = [
    'js/admin-core.js',
    'js/shared/compatibility.js',
    'js/shared/features.js',
    'js/shared/vue.js',
]

for (const profile of ['development', 'production']) {
    test(`${profile} assets run application Blade overrides without a rebuild`, async ({
        page,
    }) => {
        const rewrites = []
        const pageErrors = []
        const vueWarnings = []
        page.on('pageerror', (error) => pageErrors.push(error.message))
        page.on('console', (message) => {
            if (message.type() === 'warning' && message.text().startsWith('[Vue warn]')) {
                vueWarnings.push(message.text())
            }
        })
        await useAssetProfile(page, profile, rewrites)
        await page.goto('/application-blade-overrides')
        await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')

        await expectApplicationImageOverride(page)
        await expectApplicationTooltipOverride(page)
        expect(await inspectRuntime(page)).toEqual(expectedRuntime())
        expect(rewrites.sort()).toEqual(expectedRewrites(profile))
        expect(pageErrors).toEqual([])
        expect(vueWarnings).toEqual([])
    })
}

async function useAssetProfile(page, profile, rewrites) {
    if (profile === 'development') return

    await page.route('**/public/default/profiles/development/**', (route) => {
        const url = new URL(route.request().url())
        url.pathname = url.pathname.replace('/profiles/development/', '/profiles/production/')
        rewrites.push(url.pathname)

        return route.continue({ url: url.href })
    })
}

async function expectApplicationImageOverride(page) {
    const shell = page.locator('[data-application-image-override]')
    const image = shell.locator('#application-image')
    await expect(
        shell.locator(':scope > .application-image-nesting > #application-image'),
    ).toHaveCount(1)
    await expect(image.locator('[data-image-current]')).toHaveClass('application-image-current')
    await expect(image.locator('[data-image-insert-current]')).toHaveClass(
        'application-image-insert-current',
    )
    await image.locator('[data-image-insert-current]').click()
    await expect(image.locator('[data-image-value]')).toHaveValue('fixtures/replaced.svg')
    await image.locator('[data-image-remove]').click()
    await expect(image.locator('[data-image-value]')).toHaveValue('')
}

async function expectApplicationTooltipOverride(page) {
    await page.locator('#application-tooltip-trigger').hover()
    const tooltip = page.locator('[data-tooltip-popup]')

    await expect(tooltip).toHaveText('Override tooltip')
    await expect(tooltip).toHaveClass('application-tooltip-override')
    await expect(tooltip.locator(':scope > strong[data-tooltip-content]')).toHaveCount(1)
    expect(await tooltip.evaluate((element) => element.tagName)).toBe('ASIDE')
}

function inspectRuntime(page) {
    return page.evaluate(() => ({
        appCount: globalThis.Admin.VueApps.size,
        forbidden: {
            $: typeof globalThis.$,
            AdminLTE: typeof globalThis.AdminLTE,
            DataTable: typeof globalThis.DataTable,
            Vue: typeof globalThis.Vue,
            bootstrap: typeof globalThis.bootstrap,
            jQuery: typeof globalThis.jQuery,
        },
    }))
}

function expectedRuntime() {
    return {
        appCount: 1,
        forbidden: {
            $: 'undefined',
            AdminLTE: 'undefined',
            DataTable: 'undefined',
            Vue: 'undefined',
            bootstrap: 'undefined',
            jQuery: 'undefined',
        },
    }
}

function expectedRewrites(profile) {
    if (profile === 'development') return []

    return profileAssets.map((asset) => `/public/default/profiles/production/${asset}`).sort()
}

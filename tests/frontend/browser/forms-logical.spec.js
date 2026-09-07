import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

for (const profile of ['development', 'production']) {
    test(`${profile} forms entry boots all native form behaviors`, async ({ page }) => {
        await useFormsProfile(page, profile)
        await page.goto('/forms-logical')
        await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')

        expect(await inspectForms(page)).toEqual(expectedFormsState())
        await exerciseGeneratedFields(page)
        await exerciseFormButton(page)
        await exerciseDynamicLifecycle(page)
    })
}

async function useFormsProfile(page, profile) {
    if (profile === 'development') return

    for (const path of ['admin-core.js', 'shared/compatibility.js', 'features/forms.js']) {
        await page.route(`**/profiles/development/js/${path}`, (route) => {
            const requestUrl = new URL(route.request().url())
            const replacement = `/public/default/profiles/${profile}/js/${path}`

            return route.continue({ url: new URL(replacement, requestUrl).href })
        })
    }
}

function inspectForms(page) {
    return page.evaluate(() => {
        const component = (selector, name) => {
            const element = globalThis.document.querySelector(selector)

            return Boolean(globalThis.Admin.Components.get(element, name))
        }

        return {
            files: JSON.parse(globalThis.document.querySelector('.fileValue').value),
            forbidden: {
                $: typeof globalThis.$,
                AdminLTE: typeof globalThis.AdminLTE,
                DataTable: typeof globalThis.DataTable,
                Vue: typeof globalThis.Vue,
                bootstrap: typeof globalThis.bootstrap,
                jQuery: typeof globalThis.jQuery,
            },
            mounted: {
                buttons: component('body', 'form-buttons'),
                date: component('#published-on', 'date-control'),
                files: component('#files-control', 'files'),
                passwordFirst: component('#password-first', 'form-password'),
                passwordSecond: component('#password-second', 'form-password'),
                text: component('#generated-text', 'form-text-generator'),
                wysiwyg: component('#editor', 'wysiwyg'),
            },
            rescan: globalThis.Admin.Forms.scan(globalThis.document),
            scan: typeof globalThis.Admin.Forms.scan,
            wysiwygCalls: globalThis.__wysiwygCalls,
        }
    })
}

function expectedFormsState() {
    return {
        files: [
            {
                desc: 'Reference',
                orig: 'manual.pdf',
                title: 'Manual',
                url: 'documents/manual.pdf',
            },
        ],
        forbidden: Object.fromEntries(
            ['$', 'AdminLTE', 'DataTable', 'Vue', 'bootstrap', 'jQuery'].map((name) => [
                name,
                'undefined',
            ]),
        ),
        mounted: {
            buttons: true,
            date: true,
            files: true,
            passwordFirst: true,
            passwordSecond: true,
            text: true,
            wysiwyg: true,
        },
        rescan: 0,
        scan: 'function',
        wysiwygCalls: [['mount', 'editor', {}]],
    }
}

async function exerciseGeneratedFields(page) {
    await page.locator('#password-second .button-show').click()
    await expect(page.locator('#password-second .passwd')).toHaveAttribute('type', 'text')
    await expect(page.locator('#password-second .button-show i')).toHaveClass(/fa-eye-slash/)
    await expect(page.locator('#password-first .passwd')).toHaveAttribute('type', 'password')

    await page.locator('#password-second .generate').click()
    await expect(page.locator('#password-second .passwd')).toHaveValue('pppp')
    await page.locator('#generated-text .generate').click()
    await expect(page.locator('#generated-text .text-element')).toHaveValue('ttt')
    expect(await page.evaluate(() => globalThis.__fieldEvents)).toEqual([
        ['input', 'pppp'],
        ['change', 'pppp'],
        ['input', 'ttt'],
        ['change', 'ttt'],
    ])
}

async function exerciseFormButton(page) {
    await page.locator('#form-delete').click()
    await expect.poll(() => page.evaluate(() => globalThis.__submissions.length)).toBe(1)
    expect(await page.evaluate(() => globalThis.__submissions[0])).toEqual({
        action: '/forms/10',
        method: 'POST',
        parameters: {
            _method: 'DELETE',
            _redirectBack: '/forms',
            _token: 'forms-csrf-token',
        },
    })
}

async function exerciseDynamicLifecycle(page) {
    const result = await page.evaluate(() => {
        const host = globalThis.document.querySelector('#dynamic-form-host')
        host.innerHTML = `<div class="form-element-text"><input class="text-element" data-generate-chars="d" data-generate-length="2"><button class="generate" type="button">Generate</button></div>`
        const mounted = globalThis.Admin.Forms.scan(host)
        host.querySelector('.generate').click()
        const value = host.querySelector('.text-element').value
        const destroyed = globalThis.Admin.Components.destroy(host)

        return { destroyed, mounted, value }
    })

    expect(result).toEqual({ destroyed: 1, mounted: 1, value: 'dd' })
}

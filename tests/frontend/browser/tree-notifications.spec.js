import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

for (const profile of ['development', 'production']) {
    test(`${profile} AdminLTE tree adapter reports saves without mounting trees`, async ({
        page,
    }) => {
        await useProfile(page, profile)
        await page.goto('/tree-notifications')

        expect(await exerciseTrees(page)).toEqual({
            errors: ['Unable to reorder'],
            events: ['tree:changed', 'tree:failed'],
            mixes: [
                {
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    toast: true,
                },
            ],
            mounted: [true, true],
            rescanned: 0,
            toasts: [{ icon: 'success', title: 'Item moved' }],
        })
    })
}

async function useProfile(page, profile) {
    if (profile === 'development') return

    await page.route('**/profiles/development/js/**', (route) => {
        const requestUrl = new URL(route.request().url())
        const replacement = requestUrl.pathname.replace('/development/', `/${profile}/`)

        return route.continue({ url: new URL(replacement, requestUrl).href })
    })
}

function exerciseTrees(page) {
    return page.evaluate(async () => {
        const ids = ['tree-notification-success', 'tree-notification-failure']
        const elements = ids.map((id) => globalThis.document.getElementById(id))
        const components = elements.map((element) =>
            globalThis.Admin.Components.get(element, 'tree'),
        )

        await components[0].save()
        await components[1].save().catch(() => {})

        return {
            ...globalThis.__treeNotificationCalls,
            events: globalThis.__treeNotificationEvents,
            mounted: components.map(Boolean),
            rescanned: globalThis.Admin.Trees.scan(),
        }
    })
}

import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

const themes = [
    {
        id: 'legacy-adminlte',
        route: '/theme-capabilities-adminlte',
    },
    {
        id: 'framework-free-test',
        route: '/theme-capabilities-framework-free',
    },
    {
        id: 'tailwind',
        route: '/theme-capabilities-tailwind',
    },
]

for (const profile of ['development', 'production']) {
    test(`${profile} profiles expose equal declared capabilities with isolated themes`, async ({
        context,
    }) => {
        const results = []

        for (const theme of themes) {
            results.push(await exerciseTheme(context, theme, profile))
        }

        for (const result of results.slice(1)) {
            expect(result.behavior).toEqual(results[0].behavior)
        }
    })

    test(`${profile} Tailwind covers mode, focus, reduced motion and responsive sidebar`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 390, height: 800 })
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.addInitScript(() => globalThis.localStorage.removeItem('theme-mode'))
        await useProfile(page, profile)
        await page.goto('/theme-capabilities-tailwind')

        const sidebar = page.locator('#capability-sidebar-panel')
        await expect(sidebar).toHaveCSS('background-color', 'rgb(12, 34, 56)')
        await expect(page.locator('body')).toHaveClass(/sidebar-collapse/)
        await expect(sidebar).not.toHaveCSS('transform', 'none')

        await page.keyboard.press('Tab')
        await expect(page.locator('#theme-mode')).toBeFocused()
        await expect(page.locator('#theme-mode')).toHaveCSS('outline-style', 'solid')
        await page.keyboard.press('Enter')
        await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark')

        const transitionSeconds = await sidebar.evaluate((element) =>
            Number.parseFloat(globalThis.getComputedStyle(element).transitionDuration),
        )
        expect(transitionSeconds).toBeLessThanOrEqual(0.001)

        await page.locator('#capability-sidebar').click()
        await expect(page.locator('body')).toHaveClass(/sidebar-open/)
        await expect(sidebar).toHaveCSS('transform', 'none')
    })
}

async function exerciseTheme(context, theme, profile) {
    const page = await context.newPage()
    const errors = []
    const requests = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('response', (response) => requests.push(new URL(response.url()).pathname))
    await page.addInitScript(() => globalThis.localStorage.removeItem('sidebar-state'))
    await useProfile(page, profile)
    await page.goto(theme.route)

    const behavior = await exerciseCapabilities(page)
    assertIsolatedThemeRequests(requests, profile, theme.id)
    expect(errors).toEqual([])
    expect(await themeStylesApplied(page)).toBe(true)
    await page.close()

    return { behavior, requests }
}

async function exerciseCapabilities(page) {
    const observed = {
        markers: await compatibilityMarkers(page),
        alertRemoved: await closeAlert(page),
        dropdownExpanded: await openDropdown(page),
        ...(await selectSecondTab(page)),
        ...(await exerciseSidebar(page)),
        tooltip: await showTooltip(page),
    }

    return runtimeBehavior(page, observed)
}

function runtimeBehavior(page, observed) {
    return page.evaluate((behavior) => {
        const table = globalThis.document.getElementById('capability-table')

        return {
            ...behavior,
            forbidden: Object.fromEntries(
                ['$', 'AdminLTE', 'DataTable', 'Vue', 'bootstrap', 'jQuery'].map((name) => [
                    name,
                    typeof globalThis[name],
                ]),
            ),
            rescanned: globalThis.Admin.Components.scan(globalThis.document),
            tableMounted: Boolean(globalThis.Admin.Tables.get(table)),
        }
    }, observed)
}

function compatibilityMarkers(page) {
    return page.locator('#capability-sidebar').evaluate((element) => ({
        dismiss: globalThis.document.querySelector('#capability-alert-close').dataset.dismiss,
        toggle: globalThis.document.querySelector('#capability-dropdown').dataset.toggle,
        widget: element.dataset.widget,
    }))
}

async function openDropdown(page) {
    const dropdown = page.locator('#capability-dropdown')
    await dropdown.click()
    const expanded = await dropdown.getAttribute('aria-expanded')
    await dropdown.click()

    return expanded
}

async function showTooltip(page) {
    await page.locator('#capability-tooltip').focus()

    return (await page.locator('[role="tooltip"]').textContent())?.trim()
}

async function selectSecondTab(page) {
    await page.locator('#capability-second-tab').click()

    return {
        panels: {
            first: await page.locator('#capability-first-panel').isHidden(),
            second: await page.locator('#capability-second-panel').isVisible(),
        },
        tabSelected: await page.locator('#capability-second-tab').getAttribute('aria-selected'),
    }
}

async function exerciseSidebar(page) {
    await page.locator('#capability-branch').click()
    const treeExpanded = await page.locator('#capability-tree').isVisible()
    await page.locator('#capability-sidebar').click()
    const sidebarCollapsed = await page
        .locator('body')
        .evaluate((body) => body.classList.contains('sidebar-collapse'))

    return { sidebarCollapsed, treeExpanded }
}

async function closeAlert(page) {
    await page.locator('#capability-alert-close').click()

    return (await page.locator('#capability-alert').count()) === 0
}

function assertIsolatedThemeRequests(requests, profile, selectedTheme) {
    const profileRoot = `/public/default/profiles/${profile}/`
    const themeRequests = requests.filter(
        (path) => path.startsWith(profileRoot) && path.includes('/themes/'),
    )

    expect(themeRequests.length).toBeGreaterThan(0)
    expect(themeRequests.every((path) => path.includes(selectedTheme))).toBe(true)
    expect(requests).toContain(`${profileRoot}css/themes/${selectedTheme}.css`)

    for (const theme of themes) {
        if (theme.id !== selectedTheme) {
            expect(requests.some((path) => path.includes(theme.id))).toBe(false)
        }
    }

    if (selectedTheme === 'tailwind') {
        expect(requests).toContain(`${profileRoot}css/themes/tailwind-utilities.css`)
    }
    if (selectedTheme === 'framework-free-test') {
        expect(requests.some((path) => path.endsWith('/css/icons.css'))).toBe(false)
    }
}

function themeStylesApplied(page) {
    return page.evaluate(() => {
        return (
            globalThis
                .getComputedStyle(globalThis.document.documentElement)
                .getPropertyValue('--soa-primary-color')
                .trim().length > 0
        )
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

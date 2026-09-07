import { expect, test } from '@playwright/test'

let fixtureHeaders

test.beforeEach(async ({ page, request }, testInfo) => {
    fixtureHeaders = { 'x-fixture-scope': String(testInfo.workerIndex) }
    await page.setExtraHTTPHeaders(fixtureHeaders)
    await request.post('/__fixture/reset', { headers: fixtureHeaders })
    await page.goto('/trees')
})

test('tree lifecycle, serialization and expand controls stay scoped per tree', async ({ page }) => {
    const mounted = await page.evaluate(() => {
        return ['tree-primary', 'tree-secondary'].map((id) => {
            const element = globalThis.document.getElementById(id)
            return Boolean(globalThis.Admin.Components.get(element, 'tree'))
        })
    })
    expect(mounted).toEqual([true, true])

    const rootToggle = page.locator('#tree-primary [data-id="1"] > [data-soa-tree-toggle]')
    await expect(rootToggle).toHaveClass(/project-tree-toggle/)
    await expect(rootToggle.locator('.project-tree-toggle-glyph')).toHaveCount(1)

    await page.locator('#tree-primary [data-soa-tree-action="collapse-all"]').click()
    await expect(page.locator('#tree-primary [data-id="1"] > [data-soa-tree-list]')).toBeHidden()
    await expect(rootToggle.locator('[data-soa-tree-toggle-expanded]')).toBeHidden()
    await expect(rootToggle.locator('[data-soa-tree-toggle-collapsed]')).toBeVisible()
    await expect(
        page.locator('#tree-secondary [data-id="10"] > [data-soa-tree-list]'),
    ).toBeVisible()

    await page.locator('#tree-primary [data-soa-tree-action="expand-all"]').click()
    await expect(page.locator('#tree-primary [data-id="1"] > [data-soa-tree-list]')).toBeVisible()
    await expect(rootToggle.locator('[data-soa-tree-toggle-expanded]')).toBeVisible()
    await expect(rootToggle.locator('[data-soa-tree-toggle-collapsed]')).toBeHidden()
    expect(await serializedTree(page, 'tree-primary')).toEqual([
        { id: '1', children: [{ id: '2' }] },
        { id: '3', children: [{ id: '5' }] },
        { id: '4' },
    ])
})

test('drag-and-drop reuses a Blade leaf toggle and preserves the backend payload', async ({
    page,
    request,
}) => {
    const sourceParentToggle = page.locator('#tree-primary [data-id="1"] > [data-soa-tree-toggle]')
    const targetParentToggle = page.locator('#tree-primary [data-id="4"] > [data-soa-tree-toggle]')
    await expect(targetParentToggle).toBeHidden()
    await page.locator('#tree-primary').evaluate((tree) => {
        tree.dataset.soaTreeDragging = 'true'
    })

    const response = page.waitForResponse((item) => item.url().includes('/api/tree/reorder'))
    await page
        .locator('#tree-primary [data-id="2"] > [data-soa-tree-handle]')
        .dragTo(page.locator('#tree-primary [data-id="4"] > [data-soa-tree-list]'), {
            targetPosition: { x: 64, y: 4 },
        })
    await response

    await expect.poll(() => parentTreeId(page, '2')).toBe('4')
    await expect(targetParentToggle).toBeVisible()
    await expect(targetParentToggle).toHaveClass(/project-leaf-toggle/)
    await expect(sourceParentToggle).toBeHidden()
    await expect(page.locator('#tree-primary')).toHaveAttribute('data-soa-tree-save-state', 'idle')

    const recorded = await treeRequests(request)
    const parameters = recorded.at(-1).parameters
    expect(Object.entries(parameters)).toContainEqual([
        expect.stringMatching(/^data\[2\]\[children\]\[\d+\]\[id\]$/),
        '2',
    ])
    expect(parameters['parameters[scope]']).toBe('catalog')
    expect(await page.evaluate(() => globalThis.__treeEvents)).toEqual([
        'tree:changed',
        'display.tree::changed',
    ])
})

test('failed reorder remains visible in state and emits a native failure event', async ({
    page,
}) => {
    await page.evaluate(async () => {
        const element = globalThis.document.getElementById('tree-secondary')
        try {
            await globalThis.Admin.Components.get(element, 'tree').save()
        } catch {
            // The rejected promise is the public signal in addition to the DOM event.
        }
    })

    await expect(page.locator('#tree-secondary')).toHaveAttribute(
        'data-soa-tree-save-state',
        'error',
    )
    expect(await page.evaluate(() => globalThis.__treeEvents)).toContain('tree:failed')
})

async function serializedTree(page, id) {
    return page.evaluate((treeId) => {
        const element = globalThis.document.getElementById(treeId)
        return globalThis.Admin.Components.get(element, 'tree').serialize()
    }, id)
}

async function parentTreeId(page, id) {
    return page.locator(`[data-id="${id}"]`).evaluate((item) => {
        return item.parentElement.closest('[data-soa-tree-item]')?.dataset.id ?? 'root'
    })
}

async function treeRequests(request) {
    const response = await request.get('/__fixture/requests', { headers: fixtureHeaders })
    const state = await response.json()

    return state.requests.filter(({ kind }) => kind === 'tree-reorder')
}

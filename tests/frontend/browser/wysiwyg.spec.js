import { expect, test } from '@playwright/test'

async function openFixture(page) {
    await page.goto('/wysiwyg')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
}

function mountedEditorNames(page) {
    return page.evaluate(() =>
        globalThis.__wysiwygCalls.filter(([action]) => action === 'mount').map(([, name]) => name),
    )
}

function insertedValues(page) {
    return page.evaluate(() =>
        globalThis.__wysiwygCalls
            .filter(([action]) => action === 'insert')
            .map(([, name, value]) => [name, value]),
    )
}

function executeInsertCommands(page) {
    return page.evaluate(async () => {
        await Promise.all([
            globalThis.Admin.WYSIWYG.exec('ckeditor4-body', 'insert', 'one'),
            globalThis.Admin.WYSIWYG.exec('ckeditor5-body', 'insert', 'two'),
            globalThis.Admin.WYSIWYG.exec('markdown-body', 'insert', 'three'),
            globalThis.Admin.WYSIWYG.exec('tinymce-body', 'insert', 'four'),
        ])
    })
}

test('all legacy editor names mount through one async-safe native lifecycle', async ({ page }) => {
    await openFixture(page)
    const textareas = page.locator('textarea[data-wysiwyg-editor]')
    await expect(textareas).toHaveCount(4)
    expect(
        await textareas.evaluateAll((elements) =>
            elements.every((element) => element.dataset.wysiwygInited === '1'),
        ),
    ).toBe(true)
    await expect
        .poll(() => mountedEditorNames(page))
        .toEqual(['ckeditor', 'ckeditor5', 'simplemde', 'tinymce'])

    expect(
        await page.evaluate(() => Array.isArray(globalThis.Admin.WYSIWYG.get('ckeditor4-body'))),
    ).toBe(true)
    await executeInsertCommands(page)
    await expect
        .poll(() => insertedValues(page))
        .toEqual([
            ['ckeditor', 'one'],
            ['ckeditor5', 'two'],
            ['simplemde', 'three'],
            ['tinymce', 'four'],
        ])
})

test('dynamic WYSIWYG markup destroys and rescans without duplicate editors', async ({ page }) => {
    await openFixture(page)
    expect(
        await page.evaluate(() => {
            const host = globalThis.document.createElement('section')
            host.id = 'dynamic-editor-host'
            host.innerHTML =
                '<textarea id="dynamic-body" data-wysiwyg-editor="simplemde" data-wysiwyg-parameters="{}"></textarea>'
            globalThis.document.body.append(host)

            return [globalThis.Admin.WYSIWYG.scan(host), globalThis.Admin.WYSIWYG.scan(host)]
        }),
    ).toEqual([1, 0])
    await expect(page.locator('#dynamic-body')).toHaveAttribute('data-wysiwyg-inited', '1')

    await page.evaluate(() => {
        const host = globalThis.document.querySelector('#dynamic-editor-host')
        globalThis.Admin.Components.destroy(host)
    })
    await expect(page.locator('#dynamic-body')).not.toHaveAttribute('data-wysiwyg-inited', '1')
    await expect
        .poll(() =>
            page.evaluate(() =>
                globalThis.__wysiwygCalls.some(
                    ([action, name]) => action === 'destroy' && name === 'simplemde',
                ),
            ),
        )
        .toBe(true)
})

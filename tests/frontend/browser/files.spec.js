import { Buffer } from 'node:buffer'

import { expect, test } from '@playwright/test'

async function openFixture(page) {
    await page.goto('/files')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
}

function parseValue(value) {
    return JSON.parse(value)
}

test('legacy Files markup mounts without jQuery and keeps values in sync', async ({ page }) => {
    await openFixture(page)
    const root = page.locator('#files-fixture')
    const value = root.locator('.fileValue')

    await expect(root.locator('.fileBrowse')).toHaveAttribute('role', 'button')
    await expect
        .poll(async () => parseValue(await value.inputValue()))
        .toEqual([
            {
                desc: 'Initial',
                orig: 'start.pdf',
                title: 'Start',
                url: 'documents/start.pdf',
            },
        ])

    await root.locator('.tit').fill('Changed')
    await root.locator('.tit').blur()
    await expect.poll(async () => parseValue(await value.inputValue())[0].title).toBe('Changed')

    await root.locator('.fileLink').click()
    await expect
        .poll(async () => parseValue(await value.inputValue())[0].url)
        .toBe('https://cdn.example.test/relinked.pdf')

    await root.locator('.fileRemove').click()
    await expect(value).toHaveValue('[]')
})

test('native uploader preserves order, template structure and error messages', async ({ page }) => {
    await openFixture(page)
    const root = page.locator('#files-fixture')
    const input = root.locator('.fileBrowse input[type="file"]')
    const value = root.locator('.fileValue')

    await root.locator('.fileRemove').click()
    await input.setInputFiles([
        { buffer: Buffer.from('<svg/>'), mimeType: 'image/svg+xml', name: 'photo.SVG' },
        { buffer: Buffer.from('manual'), mimeType: 'application/pdf', name: 'manual.pdf' },
    ])

    await expect(root).toHaveAttribute('aria-busy', 'false')
    await expect
        .poll(async () => parseValue(await value.inputValue()).map((file) => file.url))
        .toEqual(['uploads/photo.SVG', 'uploads/manual.pdf'])
    await expect(root.locator('.fileThumbnail')).toHaveCount(2)
    await expect(root.locator('.fileThumbnail').first().locator('.file-image')).toHaveAttribute(
        'href',
        /\/fixtures\/pixel\.svg$/,
    )
    await expect(root.locator('.fileThumbnail').nth(1).locator('.file-extension')).toHaveText('pdf')
    await expect(root.locator('.fileThumbnail').nth(1).locator('.orig')).toHaveValue('manual.pdf')

    await input.setInputFiles({
        buffer: Buffer.from('broken'),
        mimeType: 'text/plain',
        name: 'broken.txt',
    })
    await expect
        .poll(() => page.evaluate(() => globalThis.__fileErrors))
        .toEqual([['Invalid upload', 'Broken fixture file']])
    await expect(root.locator('.fileThumbnail')).toHaveCount(2)
})

test('Files lifecycle supports explicit destroy and rescan', async ({ page }) => {
    await openFixture(page)
    const root = page.locator('#files-fixture')

    await expect(root.locator('.fileBrowse input[type="file"]')).toHaveCount(1)
    await page.evaluate(() => {
        const root = globalThis.document.querySelector('#files-fixture')
        globalThis.Admin.Components.destroy(root, 'files')
    })
    await expect(root.locator('.fileBrowse input[type="file"]')).toHaveCount(0)

    expect(await page.evaluate(() => globalThis.Admin.Files.scan(globalThis.document))).toBe(1)
    await expect(root.locator('.fileBrowse input[type="file"]')).toHaveCount(1)
    expect(await page.evaluate(() => globalThis.Admin.Files.scan(globalThis.document))).toBe(0)
})

import { expect, test } from '@playwright/test'

async function openFixture(page) {
    await page.goto('/date-controls')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
}

test('Air Datepicker owns date, datetime, time and range controls without legacy widgets', async ({
    page,
}) => {
    await openFixture(page)

    expect(
        await page.evaluate(() => {
            const ids = ['published-on', 'published-at', 'starts-at', 'report-range']

            return ids.map((id) =>
                Boolean(
                    globalThis.Admin.Components.get(
                        globalThis.document.getElementById(id),
                        'date-control',
                    ),
                ),
            )
        }),
    ).toEqual([true, true, true, true])
    await expect(page.locator('.bootstrap-datetimepicker-widget')).toHaveCount(0)
    await expect(page.locator('.daterangepicker')).toHaveCount(0)
    expect(
        await page.evaluate(() =>
            globalThis.Admin.Components.get(
                globalThis.document.getElementById('readonly-date'),
                'date-control',
            ),
        ),
    ).toBeUndefined()
})

test('selection preserves submitted formats and range separator', async ({ page }) => {
    await openFixture(page)

    await page.evaluate(async () => {
        const getPicker = (id) =>
            globalThis.Admin.Components.get(globalThis.document.getElementById(id), 'date-control')
                .picker

        await getPicker('published-at').selectDate(new Date(2027, 1, 3, 16, 45), {
            updateTime: true,
        })
        await getPicker('starts-at').selectDate(new Date(2027, 1, 3, 9, 7, 5), {
            updateTime: true,
        })
        getPicker('report-range').clear({ silent: true })
        await getPicker('report-range').selectDate([new Date(2026, 9, 1), new Date(2026, 9, 7)])
    })

    await expect(page.locator('#published-at')).toHaveValue('03.02.2027 16:45')
    await expect(page.locator('#starts-at')).toHaveValue('09:07:05')
    await expect(page.locator('#report-range')).toHaveValue('01.10.2026 - 07.10.2026')
})

test('addon, dynamic scan and scoped teardown use the shared component lifecycle', async ({
    page,
}) => {
    await openFixture(page)
    await page.locator('#date-wrapper .input-group-addon').click()
    await expect(page.locator('.air-datepicker.-active-')).toBeVisible()

    const result = await page.evaluate(() => {
        const host = globalThis.document.getElementById('dynamic-date-host')
        host.innerHTML =
            '<input id="dynamic-date" value="07.09.2026" data-date-format="DD.MM.YYYY" data-soa-date-control="date">'
        const input = host.querySelector('input')
        const mounted = globalThis.Admin.Components.scan(host)
        const instance = globalThis.Admin.Components.get(input, 'date-control')
        const destroyed = globalThis.Admin.Components.destroy(host)

        return {
            destroyed,
            isDestroyed: instance.picker.isDestroyed,
            mounted,
            recordRemoved: globalThis.Admin.Components.get(input, 'date-control') === undefined,
        }
    })

    expect(result).toEqual({
        destroyed: 1,
        isDestroyed: true,
        mounted: 1,
        recordRemoved: true,
    })
})

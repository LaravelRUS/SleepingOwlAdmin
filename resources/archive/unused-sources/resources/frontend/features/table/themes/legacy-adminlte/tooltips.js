export function createLegacyTableTooltips(admin = globalThis.Admin) {
    return {
        scan(container) {
            return admin?.Tooltips?.scan(container) ?? 0
        },
    }
}

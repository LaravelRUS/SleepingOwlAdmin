export function responseErrors(response) {
    return Array.isArray(response?.errors) ? response.errors : []
}

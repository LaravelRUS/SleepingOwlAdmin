import { installTailwindTheme } from './runtime.js'

if (globalThis.document) installTailwindTheme(globalThis)

export const THEME_ID = 'tailwind'

export { installTailwindTheme }

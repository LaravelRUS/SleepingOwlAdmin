import { installTailwindTheme } from './runtime.js'
import './features/tree/browser.js'

if (globalThis.document) installTailwindTheme(globalThis)

export const THEME_ID = 'shadcn'

export { installTailwindTheme }

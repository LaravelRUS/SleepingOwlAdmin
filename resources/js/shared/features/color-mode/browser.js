import { installColorMode } from './color-mode.js'

if (globalThis.document) installColorMode(globalThis)

export { applyColorMode, installColorMode } from './color-mode.js'

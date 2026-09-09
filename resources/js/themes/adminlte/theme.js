import '../../shared/legacy/admin/display/themes'
import './features/table/browser.js'
import './features/tree/browser.js'
import { installScrollControls } from './scroll-controls.js'

if (globalThis.document) installScrollControls(globalThis)

export const THEME_ID = 'adminlte'

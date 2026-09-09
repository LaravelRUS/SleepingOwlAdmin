import '../../shared/legacy/admin/display/themes'
import { installScrollControls } from './scroll-controls.js'

if (globalThis.document) installScrollControls(globalThis)

export const THEME_ID = 'legacy-adminlte'

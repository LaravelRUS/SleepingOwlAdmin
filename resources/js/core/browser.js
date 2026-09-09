import { installAdminCore } from './runtime/admin-core.js'

if (globalThis.document) installAdminCore(globalThis)

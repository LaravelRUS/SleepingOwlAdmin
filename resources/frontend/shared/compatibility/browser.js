import { installCompatibilityRuntime } from './runtime'

if (globalThis.document) installCompatibilityRuntime(globalThis)

export { installCompatibilityRuntime }

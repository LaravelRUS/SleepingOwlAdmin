# Vue 3 runtime and bounded island contract

## Status

SleepingOwlAdmin runs its package-owned widgets as bounded islands on native
Vue `3.5.42`. Every server template has been moved to a precompiled component;
`@vue/compat`, the runtime compiler, Vue 2 packages and `window.Vue` are absent
from dependencies and published runtime bundles. New code must use Vue 3 APIs
and isolated islands; it must not add `inline-template`, `new Vue`, global
component registration, prototype plugins or runtime template strings.

`Admin.VueApps` remains an internal lifecycle registry. Custom projects use the
small [`Admin.Vue` extension API](custom-vue-islands.md); this does not expose
Vue as a browser global.

## Runtime and dependency contract

- `vue` and the development-only `@vue/compiler-sfc` are pinned to the same
  exact version. A mixed runtime/compiler patch is not permitted.
- `@vue/compat` is removed and must not return.
- `vue-template-compiler` is removed. It belongs to Vue 2 and must not return.
- `vue-multiselect` uses the stable Vue 3 line (`3.5.x`).
- Webpack aliases every `vue` import, including dependency imports, to one
  `vue.runtime.esm-bundler.js`. The catalog, `createApp` and every component
  therefore share one renderer/reactivity instance.
- `admin-app.js` and `admin-app-dev.js` own the legacy non-Vue aggregate. They
  do not import Vue or the component catalog.
- `vue.js` is the minified production runtime and precompiled catalog;
  `vue-dev.js` is its unminified development counterpart with diagnostics and
  a source map. Neither profile contains the runtime compiler.
- `npm run production` builds both profiles, restores `admin-app-dev.js`,
  `vue-dev.js` and their maps after the production pass, then recalculates both
  development Mix hashes.
- The template loads `admin-app(.dev).js`, then the matching `vue(.dev).js`,
  then `modules.js`. This guarantees that the core `Admin` namespace exists
  before islands register and that custom modules run afterwards.
- Consumers select these committed assets with `ADMIN_DEV_ASSETS`; they do not
  install Node.js or rebuild the package.

## Bounded legacy app registry

The page-wide `new Vue({ el: '#vueApp' })` root has been removed. The Vue entry
creates one small native app for every top-level `[data-soa-vue-app]` host and
keeps their internal migration registry as `Admin.VueApps`:

- `mount(element)` and `mountAll(root)` are idempotent;
- `get(element)` and `size` make ownership observable without reading Vue
  internals;
- `unmount(element)` and `unmountAll(root)` release the app before its host is
  removed;
- the initial lifecycle pass mounts only top-level markers, then the shared
  `Admin.Components` lifecycle mounts direct nested islands from the parent's
  rendered DOM exactly once.

`#vueApp` remains a legacy layout id for non-Vue DOM integrations, but it is no
longer a Vue root. Six frozen package-owned definitions seed a dynamic catalog
and are registered on every app before mount. Env editor,
file, image, images, shared single/multiple select and related elements are all
precompiled SFCs. No package definition owns a runtime-compiled template.
`ElementSelect` imports the native Vue Multiselect dependency directly, so
neither `deselect` nor a runtime-compiled Multiselect adapter remains in the
catalog. The package does not call global `Vue.component` or `Vue.extend`, and
no consumer component is inherited from a browser global. Custom modules add
precompiled definitions through the public `Admin.Vue` extension API.

`data-soa-vue-app` is the stable server marker, while `Admin.VueApps` is an
internal migration diagnostic. Custom modules register through `Admin.Vue`.
A dynamically inserted Vue-only subtree calls `Admin.Vue.scan(insertedRoot)`
after insertion and `Admin.Vue.destroy(removedRoot)` before removal. Mixed
subtrees continue to use the broader `Admin.Components` lifecycle. Custom
element tags must
use explicit closing tags; self-closing HTML such as `<np-service />` is not a
safe Vue host. The read-only Laluna inventory contains eight such hosts and six
self-closing examples that must be updated during its pilot migration.

### Precompiled root contract

The env editor establishes the migration contract for a precompiled island;
the file, image, images, select, multiselect and related elements follow it. A
Blade view renders an empty host with one compiler guard and lifecycle
attributes:

- `v-pre` protects the empty host when it is nested in a legacy compiled template;
- `data-soa-vue-app` marks lifecycle ownership;
- `data-soa-vue-component` names a definition from the app-local catalog;
- `data-soa-vue-props` contains one HTML-escaped JSON object; or
- `data-soa-vue-props-id` references a sibling
  `<script type="application/json">` for a payload too large for an attribute.

The registry resolves the component and parses the props before it creates an
app. Referenced payloads must exist and use the exact `application/json` script
type. Unknown names, missing/wrong script nodes, malformed JSON, arrays and
scalar props fail explicitly. Vue receives the selected SFC and its props
through `createApp(component, props)`; it does not compile server markup. PHP
render contracts prove that quotes and HTML inside env, file, image, images,
select and related values remain data after the Blade boundary is decoded.
The referenced node is an inert JSON data block, not executable inline code;
a browser fixture under `script-src 'none'` proves that it remains readable,
does not execute a script-looking value and needs no CSP nonce. Executable
custom islands still load through published external bundles and the future
extension API rather than inline script bodies.

## Runtime-only boundary

There is no compatibility allowlist or component-local compatibility config.
Every Vue warning fails the browser fixture. Build contracts assert that the
dependency graph and both Vue bundles exclude `@vue/compat`, that package
imports resolve to the runtime-only distribution and that `window.Vue` is not
created. Runtime behavior obtains the Vue version from an owned app instance,
never from a global namespace.

## Transitional bridges

### Related forms

The card and no-card shells remain theme-owned Blade views, including all
consumer classes and attributes. One precompiled `RelatedElements` island owns
only group state, add/remove controls and direct SortableJS orchestration. Each
group remains trusted server-rendered form HTML and is carried as data in a
referenced JSON script encoded with `Illuminate\Support\Js::encode`; Vue never
compiles that HTML as a template.

Group parsing, field rewriting, lifecycle calls, index allocation and Sortable
construction are separate modules. New indexes are monotonic even after two
consecutive additions or a validation retry containing `new_N`. Before a
dynamic group is scanned, ordinary form controls and nested direct-island props
receive the final `relation[new_N][field]` names and indexed ids. Both inline
props and referenced JSON props are supported; cloned referenced scripts get a
unique id. Removal calls `Admin.Components.destroy(group)` before detaching the
DOM, while initial and dynamic nested islands are mounted through the shared
lifecycle. This covers the read-only Laluna `hasMany(image)` scenario.

The three related `inline-template` views, their two compatibility definitions,
the render-cache bridge and `vuedraggable@2` dependency are removed. Direct
SortableJS preserves handle-only ordering without a Vue 2 wrapper.

### File and image uploads

The precompiled file island creates Dropzone through its constructor rather
than the jQuery plugin. Upload option mapping and response-error normalization
live outside the component, the hidden value has a separate pure normalizer,
and `beforeUnmount` destroys the Dropzone instance. The actual constructor owns
`autoDiscover = false`, fixing the old CommonJS-wrapper assignment.

The image island uses the same constructor boundary and preserves stored-value
`setAssetPrefix()` behavior. Preview/value resolution, Dropzone options,
data-URL conversion, paste-buffer cleanup and transport are separate modules.
Pasted blobs use native `Admin.Http`, temporary object URLs are revoked, and
readonly/only-link modes do not create an uploader. The images island shares
those upload boundaries, uses SortableJS directly for reordering and destroys
both drivers before unmount. Its native dialog owns gallery preview and
keyboard navigation without Magnific Popup.

### Vue Multiselect

Vue Multiselect 3 is used directly through its native
`modelValue`/`update:modelValue` contract by one precompiled `ElementSelect`
SFC. The component owns presentation/orchestration only: typed numeric, string
and null id matching, immutable option copies, selected-id extraction,
form-value serialization and tag insertion live in `select-values.js`.

Single mode submits through a hidden input; multiple mode keeps a hidden native
`<select multiple>`. Both receive the PHP element's final HTML attributes
through direct `v-bind`, preserve its id/name/classes/data attributes and
dispatch one native bubbling `change` after Vue updates the submit control.
Required, readonly, display limit, selection maximum and tagging behavior is
covered in the browser fixture. The old jQuery `trigger('change')`, `deselect`
component, `LegacyMultiselect` adapter and `window.Multiselect` global are
removed.

No wrapper or compatibility configuration sits between `ElementSelect` and
Vue Multiselect. Browser tests fail on every Vue warning.

### HTTP

`vue-resource` and the global `Vue.http` interceptor have been removed. The
package had no `$http` consumers, so no compatibility facade is retained.
Vue islands use the existing `Admin.Http` service, which is backed by native
Fetch, supplies same-origin credentials and CSRF/request headers, preserves
caller headers and throws a typed `HttpError` for unsuccessful responses.

### Translations

The global `Vue.prototype.$trans` plugin and its `GLOBAL_PROTOTYPE` compat flag
have been removed. Every bounded app receives a frozen `{ trans }` service
through `app.provide`; setup components obtain the same app-local service with
`useTranslation()`. The provider captures the existing legacy `trans` function
when the Vue registry is initialized, without adding `globalProperties` or a
new mutable `window` API. The existing `window.trans` helper remains available
to non-Vue legacy modules during the broader frontend migration.

## Verification and change policy

For every island or runtime change:

1. add or retain a behavior-level browser test for the owner;
2. migrate one bounded component/island;
3. avoid globals and keep registration app-scoped;
4. run production build, frontend checks, Playwright and PHPUnit;
5. update the plan journal and the next resume point.

Do not fix migration warnings with global suppression. A warning must be fixed
at its component or dependency boundary and covered by a behavior contract.

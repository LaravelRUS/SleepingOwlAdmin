# Temporary Vue 3 compatibility boundary

## Status

SleepingOwlAdmin currently runs the legacy aggregate through Vue `3.5.42` and
`@vue/compat` `3.5.42`. This is a bounded migration state, not the extension
API or the release architecture. New code must use Vue 3 APIs and isolated
islands; it must not add `inline-template`, `new Vue`, `Vue.component`,
`Vue.extend`, `Vue.prototype`, `Vue.http`, `$set` or new compat flags.

The stage is complete only after every legacy template is moved to a
precompiled island and `@vue/compat`, the runtime compiler and `window.Vue`
are absent from production assets.

## Runtime and dependency contract

- `vue`, `@vue/compat` and `@vue/compiler-sfc` are pinned to the same exact
  version. A mixed runtime/compiler patch is not permitted.
- `vue-template-compiler` is removed. It belongs to Vue 2 and must not return.
- `vue-multiselect` uses the stable Vue 3 line (`3.5.x`).
- Webpack aliases every `vue` import, including dependency imports, to one
  selected compat runtime. This prevents Vue 3 components from carrying a
  second renderer/reactivity instance.
- The development asset profile uses `vue.cjs.js`; production uses
  `vue.cjs.prod.js`. `npm run production` restores the real development
  `admin-app-dev.js` and its source map after building the production bundle,
  then recalculates its Mix hash.
- Consumers select these committed assets with `ADMIN_DEV_ASSETS`; they do not
  install Node.js or rebuild the package.

## Bounded legacy app registry

The page-wide `new Vue({ el: '#vueApp' })` root has been removed. During the
compatibility phase, `vue_init.js` creates one small compat app for every
top-level `[data-soa-vue-app]` host and exposes their temporary lifecycle as
`Admin.VueApps`:

- `mount(element)` and `mountAll(root)` are idempotent;
- `get(element)` and `size` make ownership observable without reading Vue
  internals;
- `unmount(element)` and `unmountAll(root)` release the app before its host is
  removed;
- the initial registry pass mounts only top-level markers, then the shared
  `Admin.Components` lifecycle mounts direct nested islands from the parent's
  rendered DOM exactly once.

`#vueApp` remains a legacy layout id for non-Vue DOM integrations, but it is no
longer a Vue root. The six package-owned component definitions are exported
from one frozen catalog and registered on every app before mount. Env editor,
file, image, images, shared single/multiple select and related elements are all
precompiled SFCs. No package definition owns a runtime-compiled template.
`ElementSelect` imports the native Vue Multiselect dependency directly, so
neither `deselect` nor a runtime-compiled Multiselect adapter remains in the
catalog. The package does not call global `Vue.component` or `Vue.extend`. A
consumer's existing global compat components can still be inherited from the
selected runtime during this temporary stage; the final custom-module API
replaces that path.

`data-soa-vue-app` and `Admin.VueApps` are migration-only contracts, not the
final custom-module API. Until a legacy custom component is migrated, its Blade
view must put one marker around the component host. A dynamically inserted
host calls `Admin.Components.scan(insertedRoot)` after insertion and
`Admin.Components.destroy(removedRoot)` before removal. This is the same
lifecycle used by native components and it also supports islands nested inside
legacy related forms. Custom element tags must
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

## Explicit allowlist

The global boundary starts in `MODE: 3` with an empty Vue 2 feature allowlist.
All former flags were removed with their package owners. Any Vue compatibility
warning now fails the browser fixture; a new global suppression is not an
acceptable migration fix.

`NativeMultiselect` has one component-local
`ATTR_ENUMERATED_COERCION: 'suppress-warning'` override for the dependency's
explicit `spellcheck="false"` markup. It does not enable that behavior for any
other island. The remaining `@vue/compat` package and compiler-capable runtime
are removed in the next checkpoint, after the runtime-only build aliases and
custom-island registration path are switched together.

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

`NativeMultiselect` retains one narrow `ATTR_ENUMERATED_COERCION` override to
preserve the dependency's explicit `spellcheck="false"` result while
suppressing the compat build's unavoidable development warning. Every
unrelated compat feature is disabled, and browser tests fail on any unlisted
Vue warning.

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

For every compat removal:

1. add or retain a behavior-level browser test for the owner;
2. migrate one bounded component/island;
3. remove its global API and relevant flag in the same commit;
4. run production build, frontend checks, Playwright and PHPUnit;
5. update the plan journal and the next resume point.

Do not fix migration warnings with an unaudited global suppression. A new flag
requires an owner, a removal condition and a contract test update.

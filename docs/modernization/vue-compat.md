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
longer a Vue root. The eight package-owned component definitions are exported
with `defineComponent` and registered from one frozen catalog on every app
before mount. Three definitions still own runtime-compiled legacy templates;
the env editor, file, image and images elements are precompiled SFCs. The Vue Multiselect
compatibility wrapper is registered from the same catalog because runtime
compilation resolves its tag in the app context. The package does not call
global `Vue.component` or `Vue.extend`. A consumer's existing global compat
components can still be inherited from the selected runtime during this
temporary stage; the final custom-module API replaces that path.

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
the file, image and images elements follow it. A Blade view renders an empty
host with one compiler guard and three lifecycle attributes:

- `v-pre` protects the empty host when it is nested in a legacy compiled template;
- `data-soa-vue-app` marks lifecycle ownership;
- `data-soa-vue-component` names a definition from the app-local catalog;
- `data-soa-vue-props` contains one HTML-escaped JSON object.

The registry resolves the component and parses the props before it creates an
app. Unknown names, malformed JSON, arrays and scalar props fail explicitly.
Vue receives the selected SFC and its props through `createApp(component,
props)`; it does not compile server markup. PHP render contracts prove that
quotes and HTML inside env, file, image and images values remain data after the Blade
attribute is decoded.

## Explicit allowlist

The global boundary starts in `MODE: 3`. Vue 2 behavior is enabled only by the
following audited flags. `suppress-warning` retains that one behavior without
turning the console into an unactionable list; it is not permission to add
another legacy use.

| Flag | Temporary owner | Removal condition |
| --- | --- | --- |
| `COMPILER_INLINE_TEMPLATE` | Five remaining legacy Blade `inline-template` views | Last inline template becomes a precompiled island |
| `COMPONENT_V_MODEL` | Legacy `v-model` in select views and Vue 2 draggable | Each owner uses the Vue 3 model contract |
| `INSTANCE_CHILDREN`, `INSTANCE_SCOPED_SLOTS`, `OPTIONS_BEFORE_DESTROY`, `RENDER_FUNCTION`, `PRIVATE_APIS` | `vuedraggable@2` compatibility surface | Related islands use the selected Vue 3 drag driver |
| `WATCH_ARRAY` | Related-elements array mutation watcher | Island uses an explicit deep watcher or direct state transition |
| `ATTR_ENUMERATED_COERCION`, `CONFIG_WHITESPACE`, `INSTANCE_ATTRS_CLASS_STYLE` | Server-compiled legacy templates and dependency markup | No runtime-compiled legacy template remains |

`COMPILER_INLINE_TEMPLATE` is intentionally boolean `true`: Vue `3.5.42`
checks this compiler feature strictly and does not enable it for the string
`suppress-warning`. Its single deprecation warning is asserted by the browser
fixture. Every other unexpected Vue warning fails that fixture.

## Transitional bridges

### Repeated inline templates

The compat compiler caches an `inline-template` render function on the shared
component options object. Different instances can therefore reuse the first
instance's server template. `withLegacyInlineTemplate()` clears that cached
render just before each legacy instance is created. The current instance keeps
its already selected render function.

This bridge is applied only to the three remaining legacy catalog definitions. Remove
it together with the last `inline-template`; do not use it for new components.

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

Vue Multiselect 3 is a native Vue 3 component using
`modelValue`/`update:modelValue`. Runtime-compiled legacy templates still emit
the Vue 2 `value`/`input` contract. `LegacyMultiselect` translates only that
boundary and delegates rendering to `NativeMultiselect`, for which every
unrelated compat feature is disabled.

The one `ATTR_ENUMERATED_COERCION` override preserves the package's explicit
`spellcheck="false"` result while suppressing the compat build's unavoidable
development warning. Browser tests cover single, multiple and taggable fields
and fail on any unlisted Vue warning.

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

# Custom Vue 3 islands

SleepingOwlAdmin exposes a small `Admin.Vue` API for projects that need
stateful custom admin widgets. Ordinary consumers keep using the committed
package assets and do not install Node.js. A project needs its own frontend
build only when it authors custom Vue single-file components.

## Public API

The selected production or development Vue bundle publishes:

```js
Admin.Vue.register(name, component)
Admin.Vue.use(plugin, ...options)
Admin.Vue.scan(root)
Admin.Vue.destroy(root)
Admin.Vue.runtime
Admin.Vue.version
```

- `register()` accepts a precompiled Vue 3 component. Names are unique. It
  rescans the document, so a server-rendered host may exist before its custom
  bundle loads.
- `use()` registers an app-scoped Vue 3 plugin for apps created afterwards.
  Call it before `register()` because registration can immediately mount a
  waiting host. Repeating the same plugin object is idempotent.
- `scan()` mounts known custom and package islands in a newly inserted subtree.
- `destroy()` unmounts Vue islands in a subtree without destroying unrelated
  `Admin.Components` records.
- `runtime` is the package-owned Vue module namespace used by every island.
  It exists so a consumer bundle can externalize `vue`; it is not a Vue 2
  browser global. `window.Vue` remains undefined.
- `version` reports the selected runtime version. Production and development
  profiles expose the same API and use different builds of that one runtime.

`Admin.VueApps` remains an internal migration diagnostic. Custom code should
not mount through it.

## Load and build contract

Register the project bundle after `admin-vue-init`:

```php
Meta::addJs('project-admin-vue', asset('js/admin.js'), ['admin-vue-init']);
```

The API tolerates both positions relative to `admin-modules-load`: an unknown
host is left pending, and a later `register()` mounts it. The declared
`admin-vue-init` dependency is still mandatory because the public API and Vue
runtime do not exist earlier.

The consumer build must not bundle another Vue copy. With Vite:

```js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'resources/js/admin.js',
            formats: ['iife'],
            name: 'ProjectAdmin',
        },
        outDir: 'public/js',
        rollupOptions: {
            external: ['vue'],
            output: {
                entryFileNames: 'admin.js',
                globals: { vue: 'Admin.Vue.runtime' },
            },
        },
    },
})
```

Compiled SFC imports such as `import { ref } from 'vue'` then resolve to
`Admin.Vue.runtime`. The component renderer, reactivity helpers, plugins and
package islands all use the same Vue instance. A complete copyable example is
in [`examples/custom-vue-island`](examples/custom-vue-island/README.md).

## Blade data boundary

Blade renders an ordinary explicit-closing host. It passes JSON data, not a
Vue template:

```blade
@php($propsId = 'order-status-'.$order->getKey().'-props')

<script id="{{ $propsId }}" type="application/json">
    {!! \Illuminate\Support\Js::encode(['orderId' => $order->getKey()]) !!}
</script>
<section
    v-pre
    data-vue-app
    data-vue-component="order-status"
    data-vue-props-id="{{ $propsId }}"
></section>
```

Do not use `:prop="{{ $value }}"`, `inline-template` or runtime template
strings. Do not self-close custom HTML elements: write `<my-widget></my-widget>`
when a custom tag is unavoidable. An ordinary empty `section` host is safer.

For a small payload, `data-vue-props` may contain one HTML-escaped JSON
object. Use a referenced `application/json` node for large or nested data.

Dynamic DOM owners call `Admin.Vue.scan(insertedRoot)` after insertion and
`Admin.Vue.destroy(removedRoot)` before removal. When the subtree also contains
non-Vue managed controls, use the broader `Admin.Components.scan()` and
`Admin.Components.destroy()` lifecycle instead.

## Laluna pilot inventory

The read-only `D:\domains\laluna.kit\Modules` inventory provides eight real
server hosts:

| Module | Blade view | Current Vue 2 host | Props |
| --- | --- | --- | --- |
| Person | `check-person.blade.php` | `check-person` | `persondata`, `loadcount`, `access` |
| Stock | `index.blade.php` | `stock-component` | `categories` |
| Taxation | `create-fake.blade.php` | `fake-check` | `fops` |
| Taxation | `basket-form.blade.php` | `basket-count` | `counts` |
| NovaPoshta | `service.blade.php` | `np-service` | none |
| NovaPoshta | `order-form.blade.php` | `ttn-check` | none |
| Scanner | `relocation.blade.php` | `relocation` | `couriers` |
| Scanner | `inventory.blade.php` | `inventarisation` | `count` |

Their SFC definitions live in the project's shared `resources/js/components`
directory and are globally registered by `resources/js/admin.js`; there are no
`.vue` sources inside `Modules`. This is the supported migration shape: keep
module-owned Blade hosts, migrate the shared consumer entry to `Admin.Vue`, and
compile the SFCs once in the project bundle.

For the pilot migration:

1. upgrade the project build to Vue 3 and externalize `vue`;
2. migrate VeeValidate 2, VueLazyload, `vue-moment`, `vue-tel-input`, Vuex 3
   and other Vue 2-only dependencies independently;
3. replace `Vue.use()` with `Admin.Vue.use()` before registering hosts;
4. replace every `Vue.component()` with `Admin.Vue.register()`;
5. replace `Vue.filter('nFormat', ...)` with an imported formatting function;
6. replace component-level global Axios and jQuery tooltip calls with explicit
   services/native lifecycle code;
7. move all Blade props to the JSON boundary and replace the six self-closing
   hosts with explicit closing markup.

The Stock host is a separate consideration: its current component uses Vuex
and is registered by the public-site `resources/js/app.js`, not by the admin
entry. Confirm which layout owns that page before moving it into the admin
bundle.

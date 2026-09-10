# Copyable custom island stub

Copy the files into the corresponding project paths, rename the component and
props, then register the compiled project asset from `app/Admin/bootstrap.php`.
The package itself remains prebuilt; this Vite configuration belongs only to a
project that authors custom Vue components.

Files:

- `resources/views/admin/order-status.blade.php` — server host and JSON props;
- `resources/js/components/OrderStatus.vue` — precompiled Vue 3 SFC;
- `resources/js/admin.js` — public API registration;
- `vite.config.mjs` — shared-runtime external configuration;
- `app/Admin/bootstrap.php` — asset ordering.

Set `ADMIN_DEV_ASSETS=true` while debugging. SleepingOwlAdmin will load its
development Vue runtime and source map; the project controls source maps for
its own custom bundle.

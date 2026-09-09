# Archived legacy frontend sources

These files are intentionally excluded from every Webpack/Mix entrypoint. They
are retained temporarily for migration history while the built-in Tailwind
theme is being completed.

Do not import code from this directory. The active replacements are:

| Archived source | Active replacement |
| --- | --- |
| `scripts/components/asset.js` | `resources/js/core/assets/runtime-assets.js` |
| `scripts/components/events.js` | `resources/js/core/events/event-bus.js` |
| `scripts/components/lifecycle.js` | `resources/js/core/lifecycle/component-lifecycle.js` |
| `scripts/components/storage.js` | `resources/js/core/storage/storage-repository.js` |
| `scripts/components/tables.js` | `resources/js/core/tables/table-registry.js` |
| `scripts/components/wysiwyg.js` | `resources/js/shared/features/forms/wysiwyg/wysiwyg-registry.js` |
| `scripts/libs/sweetalert.js` | `resources/js/shared/compatibility/runtime.js` |

Legacy styles remain in `resources/css/themes/adminlte/legacy` because the AdminLTE
compatibility bundle still compiles them. They are not part of this archive.

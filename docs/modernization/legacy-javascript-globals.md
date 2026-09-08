# Legacy JavaScript compatibility boundary

The direct `AdminLTETheme` runtime is jQuery-free and does not publish global
Vue, DataTable, Bootstrap or AdminLTE objects. The headless core exposes only
the stable `Admin` services required by independent feature drivers.

`shared:compatibility` keeps the bounded browser API used by existing project
modules: `Admin.Config`, `Admin.Url`, `Admin.User`, `Admin.Messages`,
`Admin.Modules`, `Admin.WYSIWYG`, `_`, `axios`, `Swal` and `trans`. It does not
import a UI framework, table engine, Vue or jQuery.

Laravel remains the source of translated strings. The package-owned `trans`
function resolves the server-provided map by dot notation, substitutes legacy
`:parameter` placeholders and returns the key when a string is missing. No
general `i18next` or Vue-specific i18n runtime is shipped.

| Legacy usage | Current boundary |
| --- | --- |
| `$()` / `jQuery()` and delegated plugin calls | native DOM APIs, `Admin.Components` and documented feature events |
| global `DataTable` / `$.fn.dataTable` | `Admin.Tables` and `data-table-engine` options |
| global `Vue`, `Vue.component`, `Vue.prototype` | precompiled islands registered through `Admin.Vue` |
| Bootstrap/AdminLTE jQuery plugins | native drivers using retained `data-toggle`, `data-dismiss` and `data-widget` markers |
| global event mutation | `Admin.Events` or bubbling `CustomEvent` contracts |

The ESLint and compiled-asset gates reject accidental return of removed globals
or jQuery runtime code. `TemplateDefault` remains a deprecated compatibility
adapter for older published configuration, not a target for new extensions.

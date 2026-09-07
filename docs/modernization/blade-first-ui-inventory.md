# Blade-first UI inventory

## Purpose and boundary

This inventory records every package-owned DOM construction path found in the
current first-party JavaScript and Vue sources. It is the executable design
boundary for the remaining theme migration:

- Blade owns visible first-party structure, text, icons and presentation
  classes wherever the server can render the required markup;
- JavaScript owns behavior, state, lifecycle, transport and safe population of
  an already-rendered template;
- precompiled Vue components and third-party widgets are explicit, bounded
  exceptions rather than a general reason to move rendering into JavaScript;
- PHP does not translate semantic component names into framework classes;
  AdminLTE, Tailwind and project themes put their actual classes in their own
  Blade views;
- the existing logical view names and Laravel application-over-package override
  priority remain public compatibility contracts;
- all built-in templates and Vue components are distributed in both prepared
  asset profiles, so a consumer does not run npm or rebuild the package.

The scan covers `resources/frontend` and `resources/assets/js_owl`. The
read-only reference project is intentionally not scanned again.

## Decision rules

1. If first-party JavaScript creates an element a user sees or may want to
   restyle, move that element to a theme-owned Blade partial or a
   Blade-rendered `<template>`.
2. A feature may use stable `data-*` behavior hooks and neutral structural
   classes. It may not choose Bootstrap, AdminLTE or Tailwind classes.
3. A theme or project view writes concrete classes directly. No PHP class map,
   semantic resolver or implicit fallback to AdminLTE is introduced.
4. JavaScript may clone a rendered template, bind events, update ARIA/state,
   toggle `hidden`, and fill untrusted values through DOM properties or
   `textContent`. It must not rebuild the same presentation with
   `createElement()`.
5. Runtime-only Vue islands may render their interactive inner DOM. Their Blade
   owners supply concrete theme classes/options as props; Blade continues to
   own the surrounding label, help, validation and layout markup where
   practical.
6. DOM produced inside a pinned third-party widget remains vendor-owned. The
   selected adapter, Sass variables and documented options control its
   presentation without copying the vendor renderer into PHP.
7. Technical elements that are never presentation, such as temporary submit
   forms, hidden file inputs and runtime `<script>`/`<link>` nodes, remain in
   JavaScript.

## Blade-template candidates

This list records the visible first-party UI that was constructed in
JavaScript when the inventory was created. Completed rows have already moved
their presentation to Blade; the remaining rows must be migrated before the
direct theme runtime switch.

| Status | Priority | JavaScript behavior owner | Original visible DOM | Blade owner / target contract | Compatibility strategy |
| --- | --- | --- | --- | --- | --- |
| Complete | 1 | `features/table/autoupdate/table-auto-update.js` | `.autoupdater-close` button and its `×` text | Historical logical view `default.helper.autoupdate`, backed by the feature host `features.datatables.autoupdate`, supplies a rendered control template | The existing config keys, host marker, label, color property and table matching remain. JavaScript clones exactly one control root, binds stop behavior and owns only the ProgressBar lifecycle. A project override may replace tag, classes, icon and nesting while preserving the documented hooks. |
| Complete | 1 | `features/tree/tree-view.js` | `.soa-tree-toggle` button and `+`/`−` presentation | `default.display.tree_children` renders a toggle for every item that can accept children | `data-soa-tree-toggle` remains the behavior hook. Blade renders both states/text or icons; JavaScript changes only `hidden`, `aria-expanded`, `aria-label` and collapsed state. Leaf toggles stay rendered but hidden so drag-and-drop can reveal them without creating markup. |
| Complete | 2 | `features/table/editing/inline-editor-view.js` | Entire editor root, form, title, input area, actions, error block, buttons and all nine control shapes | Existing logical view `default.column.editable.partials.editor` emits the trigger and delegates its Blade `<template>` shell to `partials.editor_template`; each type owns a partial below `partials.controls` | Every editable-column PHP class and logical view path remains. Project overrides may replace the shell, one control, classes and nesting while retaining structural hooks. JavaScript clones the template, refreshes the current value, binds submit/cancel/Escape/date lifecycle, and never chooses presentation classes or creates visible elements. |
| Pending | 3 | `features/sidebar/sidebars.js` | `#sidebar-overlay` | Theme layout, currently `default._layout.inner` (optionally through a theme-local partial) | Keep the established id and `data-widget="pushmenu"`; do not add `data-soa-sidebar*`. JavaScript only shows/hides the existing overlay and handles click/Escape/focus/persistence. |
| Pending | 4 | `features/tooltip/tooltips.js` | Active `role="tooltip"` popup | A theme layout-level `<template>` supplied to the neutral tooltip feature | Keep `data-toggle="tooltip"`, `title`, `data-original-title` and `data-placement`. JavaScript clones the popup, assigns a unique id and text content, positions it, and manages focus/ARIA. A narrowly documented neutral fallback may remain for custom themes that omit the optional presentation template. |

### Inline editor template hooks

The inline editor migration needs structural hooks rather than a fixed tree.
The built-in templates will expose roles for root, form, title, control host,
actions, submit, cancel and error. A project override may change elements,
classes and nesting while preserving those roles. Control templates cover
`text`, `textarea`, `number`, `range`, `select`, `checkbox`, `checklist`, `date`
and `datetime`; option labels always use `textContent` or Blade escaping.

This is intentionally a larger, separate implementation checkpoint. It needs
PHP render contracts and browser fixtures proving custom classes and changed
nesting, not only unit tests of the default DOM.

## Already Blade-first dynamic markup

These paths manipulate dynamic DOM but do not own its presentation and should
remain examples for the migrations above.

| JavaScript path | Blade owner | Why it already satisfies the boundary |
| --- | --- | --- |
| `features/forms/files/files-template.js` | `default.form.element.files` | JavaScript clones the server-rendered `.RenderFile` template and fills known fields, links and text. Both the historical inert script form and `<template>` remain accepted for project overrides. |
| `assets/js_owl/admin/form/related/related-dom.js` | `default.form.element.related.group` via `default.form.element.related.inner_element` | JavaScript parses trusted server-rendered group HTML, rewrites ids/names/props and runs lifecycle hooks. It does not invent group classes or controls. |
| `features/table/editing/inline-editor-value.js` | Editable column view and server response | The optional `innerHTML` assignment updates developer-authorized display content after save; it does not construct editor presentation. The default remains text content. |

## Precompiled Vue internals

These components may keep Vue-rendered interactive inner DOM because the
runtime-only build cannot compile arbitrary Blade templates. This exception is
limited to the island boundary; it does not authorize hardcoded framework
classes as the final theme API.

| Vue component | Current Blade owner | Boundary to preserve or add |
| --- | --- | --- |
| `admin/display/env-editor.vue` | `default.env_editor` and `default._partials.env_editor` | Blade owns page/header composition and supplies labels plus concrete form/card/table/button/icon classes. Vue owns dynamic rows, add/remove state and field naming. |
| `admin/form/file.vue` | `default.form.element.file` | Blade keeps label/help/error/layout ownership and supplies classes/icons. Vue owns upload progress, current file state and interactive inner controls. |
| `admin/form/image.vue` | `default.form.element.image` | Same boundary as file; preview/upload/paste state remains inside the island. |
| `admin/form/images.vue` | `default.form.element.images` | Blade supplies gallery/dialog/control classes and icons. Vue owns the dynamic collection, upload, ordering and dialog state. |
| `admin/form/select.vue` | `default.form.element.partials.select_island`, reached from `select`, `multiselect`, `selectajax` and `dependentselect` | Blade passes final field attributes and theme classes/options. Vue owns selection, remote/dependent loading, tagging and hidden/native submit synchronization. |
| `admin/form/related/elements.vue` | `default.form.element.related.inner_element` plus the Blade-rendered `related.group` | Existing group HTML stays Blade-owned. Vue owns collection state, add/remove bookkeeping and Sortable orchestration; its wrapper/action classes become Blade props or Blade-owned outer markup. |

All six components remain precompiled in `shared:vue` for both production and
development profiles. No runtime compiler, HTML template string, global Vue or
consumer rebuild is allowed.

## Vendor-owned DOM

The following visible markup is generated by a pinned third-party renderer and
is not a candidate for Blade duplication.

| Vendor boundary | Vendor-owned UI | First-party control surface |
| --- | --- | --- |
| DataTables 3 / Responsive 4 | wrapper, length/search/info/paging controls and responsive rows | `data-table-engine`, normalized public options, server-side wire contract and separate AdminLTE/Tailwind Sass adapters |
| Air Datepicker | calendar popup | native input/addon Blade markup, locale/options modules and theme Sass variables |
| GLightbox | lightbox dialog/overlay | Blade trigger/gallery markup, neutral lifecycle adapter and theme Sass |
| ProgressBar.js | auto-update SVG line | Blade-rendered close control and host; feature owns timing, color custom property and teardown |
| Vue Multiselect 3 | select widget internals inside the precompiled select island | Blade props/field attributes plus Vue component adapter and theme stylesheet |
| Dropzone | hidden upload mechanics; previews are disabled | Blade/Vue controls and preview markup, explicit upload options and lifecycle teardown |
| CKEditor 4/5, TinyMCE and SimpleMDE | editor chrome created by the selected editor | Blade textarea/config plus lazy WYSIWYG adapter boundary |
| SweetAlert2 | legacy notification/confirmation dialog | Theme-owned notification adapter and labels; it must not leak into neutral tree/table behavior |

SortableJS changes ordering only and does not own item presentation. The
package's native tooltip is first-party, so unlike the vendor entries above its
popup remains a Blade-template candidate.

## Technical non-UI DOM

These JavaScript-created nodes are implementation details and remain outside
Blade:

| Path | Technical DOM / reason |
| --- | --- |
| `core/assets/runtime-assets.js`, `core/runtime/admin-core.js` and the legacy `assets/js_owl/components/asset.js` bridge | Runtime `<script>`, `<link>` and image probes used to load or verify assets. |
| `core/dom/forms.js` | Temporary POST form and hidden inputs used for navigation/action submission. |
| `features/forms/files/files-uploader.js` | Hidden native multiple-file input attached to the existing Blade browse control. |
| `assets/js_owl/components/messages.js` | Legacy hidden paste-buffer image; it is non-presentational and remains technical DOM until the legacy prompt service is migrated. |
| `assets/js_owl/admin/form/related/related-dom.js` | Temporary inert `<template>` used only to materialize Blade-rendered HTML. |

`FormData`, URL search parameters, JSON payload scripts and lifecycle event
objects are data/transport structures rather than DOM presentation and are not
part of the rendering migration.

## Override and no-build contract

For each migrated candidate, tests must prove all of the following:

- the existing logical owner resolves through the selected template/theme;
- an application-level override wins over the package view;
- arbitrary classes and a changed but hook-compatible nesting reach the
  browser unchanged;
- JavaScript finds behavior hooks without assuming Bootstrap/AdminLTE classes;
- built-in AdminLTE and Tailwind templates can choose different concrete
  classes without PHP translation;
- both committed asset profiles run the same server-rendered template contract;
- no test or consumer fixture invokes npm, Mix, Vite or a runtime Vue compiler.

## Implementation order

1. [Complete] Move the table auto-update close control and tree toggle to
   Blade templates; add unit, PHP render and browser override contracts.
2. [Complete] Move the complete inline editor presentation to per-editor Blade
   templates; cover every editor type, arbitrary classes and changed nesting.
3. Render the sidebar overlay in each theme layout and remove JavaScript DOM
   construction.
4. Add the optional layout-level tooltip popup template with a neutral fallback
   contract for minimal custom themes.
5. Pass concrete classes/options from Blade into every precompiled Vue island
   and verify AdminLTE/Tailwind/custom render boundaries.

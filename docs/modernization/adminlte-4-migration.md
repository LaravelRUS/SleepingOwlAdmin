# AdminLTE 3 to 4 migration

SleepingOwlAdmin now ships AdminLTE 4.9.1, Bootstrap 5.3.8 and Popper 2.11.8.
The direct `AdminLTETheme` runtime contains no jQuery and is delivered as ready
production and development assets, so Composer consumers do not rebuild the
frontend.

## Package view changes

Application overrides under `resources/views/vendor/sleeping_owl` still win and
keep the same `sleeping_owl::default.*` logical names. Override only the views
whose markup you need to change; republishing the complete view tree is not
required.

| Previous markup | Current package markup |
| --- | --- |
| `.wrapper` | `.app-wrapper` |
| `.main-header` | `.app-header` |
| `.main-sidebar` | `.app-sidebar` |
| `.content-wrapper` | `.app-main` |
| `.content-header` | `.app-content-header` |
| `.content` | `.app-content` |
| `.main-footer` | `.app-footer`; `.main-footer` remains as a project compatibility class |
| `.brand-link` directly in the sidebar | `.sidebar-brand > .brand-link` |
| `.nav-sidebar` | `.sidebar-menu` |
| `.panel`, `.panel-heading`, `.panel-body`, `.panel-footer` | `.card`, `.card-header`, `.card-body`, `.card-footer` |
| `.card-default`, `.card-heading` | plain `.card`, `.card-header` |
| `.well` | Bootstrap 5 border, radius and spacing utilities |
| `.form-group` without spacing | `.form-group.mb-3`; the old class remains as a custom-CSS hook |
| `.control-label` | `.form-label.control-label`; the old class remains as a compatibility hook |
| `.radio`, `.checkbox` | native Bootstrap 5 `.form-check` markup |
| `.btn-xs` | `.btn-sm` |
| `.float-left`, `.float-right` | `.float-start`, `.float-end` |
| `.ml-*`, `.mr-*`, `.pl-*`, `.pr-*` | `.ms-*`, `.me-*`, `.ps-*`, `.pe-*` |
| `.font-weight-*` | `.fw-*` |

Package tabs now use Bootstrap 5 nav markup and the native SleepingOwl tabs
driver. The package keeps `data-tab` and historical `data-toggle="tab"` while
also rendering `data-bs-toggle="tab"`.

## JavaScript markers

AdminLTE 4 markers are present on package views:

- `data-lte-toggle="sidebar"` for the push menu;
- `data-lte-toggle="treeview"` on the menu root;
- `data-bs-toggle` and `data-bs-dismiss` for Bootstrap-oriented markup;
- `data-bs-theme` for color mode.

For a soft major-version transition, public `data-toggle`, `data-dismiss` and
`data-widget` markers remain beside the new markers. Native feature drivers
accept both forms. Do not introduce `data-soa-*`; custom views should use the
documented existing or simple feature-specific `data-*` hooks.

AdminLTE's jQuery plugin calls no longer exist. Custom code should use native
DOM events and the documented `Admin.Components`, `Admin.Tables`, `Admin.Vue`
and feature APIs. Bootstrap/AdminLTE classes remain owned by Blade and theme
Sass rather than PHP semantic mappings or JavaScript render functions.

## Color mode, palette and icons

The old body `.dark-mode` class is replaced by `data-bs-theme` on the document
root. SleepingOwl also mirrors the choice to `data-color-scheme` for public
`--soa-*` theme properties.

AdminLTE 3 palette/skin Sass is not loaded. Sidebar color comes from
`--soa-sidebar-bg`, including the validated `sidebar_background_color` config
override. Font Awesome remains a separate `shared:icons` bundle because icons
are shared by every theme; changing to Bootstrap Icons is not required.

## Third-party controls

The package does not restore AdminLTE 3's bundled jQuery plugins. Current
owners are DataTables 3 with Bootstrap 5 presentation, Vue Multiselect 3,
Air Datepicker, SortableJS, GLightbox and native feature drivers. Existing PHP
DSL, field names, server-side DataTables processing and Blade overrides remain
the public boundary.

## Updating an application

1. Update the Composer package and run `php artisan sleepingowl:update`.
2. Keep the published `sleeping_owl.php`; missing new keys use package defaults.
3. Review only application-overridden Blade views against the table above.
4. Replace project jQuery/AdminLTE plugin calls with the native public APIs.
5. Confirm light/dark mode, sidebar, tables, forms and uploads in the application.

`ADMIN_DEV_ASSETS=true` selects the ready development profile with source maps.
The default production profile is prebuilt; neither choice requires Node.js in
the consuming Laravel project.

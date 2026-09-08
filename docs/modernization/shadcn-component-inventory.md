# shadcn/ui provenance and component inventory

## Pinned upstream

TailwindTheme uses shadcn/ui as a reviewed source of markup, accessibility
states and Tailwind class recipes. It does not install or execute the React
implementation.

| Item | Pinned value |
| --- | --- |
| Repository | `https://github.com/shadcn-ui/ui.git` |
| Registry style | `new-york-v4` |
| CLI/package | `shadcn@4.21.0` |
| Annotated Git tag object | `5563a4640ae559d5add7a237748637c8b3ce82b2` (`shadcn@4.21.0`) |
| Peeled source commit | `7c9eaba1c0a6404c990c144a654792e3313c650d` |
| npm tarball | `https://registry.npmjs.org/shadcn/-/shadcn-4.21.0.tgz` |
| npm SHA-1 | `7610399358644b8398b9f50b51c40d72dd592f21` |
| npm SRI | `sha512-UU2mFNusW8C5rvadKdH69vERYZqUlOOlXBcf0MYhYLdTGP6DPti7X4qovCu+RTfCqsAgq/T+YfE0Vnttxh9aiw==` |
| Maintainer requirement | Node.js `>=20.18.1`; no consumer Node.js requirement |
| License | MIT, upstream `LICENSE.md` SHA-256 `a14c2d6fb5ba9925cba04633226a3b93e6c5566ca6b550dbfaead7ab3fa93b24` |

The source snapshot is browsable at
[`shadcn@4.21.0`](https://github.com/shadcn-ui/ui/tree/7c9eaba1c0a6404c990c144a654792e3313c650d).
The required notice is stored verbatim in
[`licenses/shadcn-ui-MIT.md`](licenses/shadcn-ui-MIT.md). MIT permits copying,
modification and distribution, including generated production CSS, provided
the copyright and permission notice remains with substantial copied portions.

## Allowed update workflow

1. A maintainer selects a new exact `shadcn@<version>`; floating tags and
   `latest` are not valid source pins.
2. Verify npm tarball integrity and the official annotated Git tag, then check
   out its peeled commit. Re-check the upstream license and its SHA-256.
3. Compare only the inventoried `apps/v4/registry/new-york-v4/ui/<name>.tsx`
   files. The CLI may fetch or diff a snapshot in a temporary maintainer
   workspace but must not overwrite package Blade/Sass sources.
4. Port relevant markup, Tailwind utilities, tokens and accessibility states
   deliberately into the listed Blade owner. Do not copy React, Radix,
   `class-variance-authority`, `lucide-react` or event/state behavior.
5. Keep SleepingOwl behavior hooks and the behavior owner in the table below;
   update this inventory, the notice when required, targeted render/browser
   contracts and prepared assets in the same checkpoint.

Composer consumers receive the resulting Blade views and prepared CSS. They
never run shadcn CLI, Tailwind content scanning or npm.

## Selected recipes

Every row refers to registry type `registry:ui`, style `new-york-v4`, source
commit `7c9eaba1c0a6404c990c144a654792e3313c650d`. A local owner is the planned
Blade primitive; the listed consumers remain the stable logical view paths.

| Registry name | Local Blade owner | SleepingOwl consumers and required states | Behavior owner / reason |
| --- | --- | --- | --- |
| `alert` | `themes/tailwind/components/ui/alert.blade.php` | `_partials/messages/{success,info,warning,error}` and asset-health warning; title/body, dismissible, success/warning/error | Alert driver and native status semantics; establishes the common message recipe. |
| `alert-dialog` | `themes/tailwind/components/ui/alert-dialog.blade.php` | destructive table/form actions; closed/open, labelled description, cancel/confirm, pending/error | Existing confirmation/notification adapter; only the accessible destructive-dialog presentation is ported. |
| `attachment` | `themes/tailwind/components/ui/attachment.blade.php` | `form/element/{file,files,image,images,upload}`; queued/uploading/success/error/readonly/removable | Existing Vue file/image islands and upload driver; supplies a consistent file-row recipe. |
| `badge` | `themes/tailwind/components/ui/badge.blade.php` | navigation and tab badges, boolean/status columns; neutral/success/warning/destructive/outline | Blade value rendering; compact status and count presentation. |
| `breadcrumb` | `themes/tailwind/components/ui/breadcrumb.blade.php` | `_partials/breadcrumbs`; root/intermediate/current/overflow and compact viewport | Native links plus `aria-current`; preserves server-rendered navigation. |
| `button` | `themes/tailwind/components/ui/button.blade.php` | form buttons, row/bulk actions, tree and upload controls; default/destructive/outline/secondary/ghost/link, sizes, disabled/loading/focus | Native button/link plus existing action drivers; base interactive primitive. |
| `button-group` | `themes/tailwind/components/ui/button-group.blade.php` | `form/buttons`, table toolbar and grouped actions; horizontal/vertical, attached/separated, disabled member | Blade grouping and existing action drivers; keeps dense CRUD actions coherent. |
| `card` | `themes/tailwind/components/ui/card.blade.php` | `form/card/*`, dashboard widgets and display shells; header/body/footer/actions, nested, loading/error | Blade composition; primary page-section container. |
| `checkbox` | `themes/tailwind/components/ui/checkbox.blade.php` | form/column/filter checkboxes and bulk selection; unchecked/checked/indeterminate/disabled/invalid/focus | Native checkbox and table/form drivers; no Radix checkbox runtime. |
| `collapsible` | `themes/tailwind/components/ui/collapsible.blade.php` | nested navigation, tree nodes and filter panels; expanded/collapsed, animated/reduced-motion, disabled | Sidebar/tree drivers own state and ARIA; only disclosure states and classes are adapted. |
| `dialog` | `themes/tailwind/components/ui/dialog.blade.php` | image/gallery dialogs, generic modal and editor overlays; closed/open, labelled, focus trapped, escape/close | Existing modal/lightbox/Vue island boundary; no Radix dialog runtime. |
| `dropdown-menu` | `themes/tailwind/components/ui/dropdown-menu.blade.php` | header/user menu and display actions; closed/open, active/focus, disabled, checked, submenu | Public dropdown driver owns keyboard/state; visual menu anatomy is ported. |
| `empty` | `themes/tailwind/components/ui/empty.blade.php` | empty tables, dashboard, tree, uploads/gallery and no-results states; icon/title/body/action | Blade or vendor empty callback; gives all data-heavy empty states one pattern. |
| `field` | `themes/tailwind/components/ui/field.blade.php` | `form/element/*`, help and errors, related groups; vertical/horizontal/responsive, required, help, one/many errors | Blade and native validation own semantics; replaces React form composition. |
| `input-group` | `themes/tailwind/components/ui/input-group.blade.php` | text addons, date/time controls, filters and inline editor; leading/trailing addon, focus-within, disabled/invalid | Native controls plus existing feature drivers; preserves add-on presentation without JS rendering. |
| `input` | `themes/tailwind/components/ui/input.blade.php` | text/password/number/date/time/filter/generator inputs; normal/placeholder/focus/disabled/readonly/invalid | Native input; shared control recipe used by forms and tables. |
| `label` | `themes/tailwind/components/ui/label.blade.php` | form labels, filter labels and checkbox/radio captions; required/disabled and control association | Native `label`; consistent accessible labelling. |
| `native-select` | `themes/tailwind/components/ui/native-select.blade.php` | native select fallback, table length and filters; placeholder/value, required/disabled/invalid | Native select and existing Vue select island boundary; shadcn React select/combobox are intentionally excluded. |
| `pagination` | `themes/tailwind/components/ui/pagination.blade.php` | DataTables paging adapter; previous/next, current, disabled, ellipsis and compact viewport | DataTables 3 owns generated DOM/state; recipe supplies presentation and ARIA expectations only. |
| `progress` | `themes/tailwind/components/ui/progress.blade.php` | uploads and table auto-update; determinate/indeterminate, paused/success/error, reduced-motion | Upload/auto-update drivers own values and lifecycle; no Radix progress runtime. |
| `radio-group` | `themes/tailwind/components/ui/radio-group.blade.php` | radio and boolean choices; unchecked/checked/disabled/invalid/focus, horizontal/stacked | Native radio inputs; reusable choice-group presentation. |
| `separator` | `themes/tailwind/components/ui/separator.blade.php` | navigation dividers, cards, menus and toolbars; horizontal/vertical and decorative/semantic | Native element/ARIA; small structural primitive reused across shells. |
| `sidebar` | `themes/tailwind/components/patterns/sidebar.blade.php` | `_layout/*` and `_partials/navigation*`; expanded/collapsed, nested/active, mobile overlay, keyboard focus | Existing sidebar driver/storage and Blade navigation own behavior/content; React context, sheet and cookie code are excluded. |
| `skeleton` | `themes/tailwind/components/ui/skeleton.blade.php` | initial table/widget/island loading; text/row/card shapes and reduced-motion | Server/Vue/vendor loading state; stable placeholder presentation. |
| `spinner` | `themes/tailwind/components/ui/spinner.blade.php` | buttons, remote selects, tables and uploads; labelled/unlabelled, small/default, reduced-motion | Existing async owners toggle visibility; shared busy indicator. |
| `switch` | `themes/tailwind/components/ui/switch.blade.php` | boolean form/inline controls; on/off, disabled/readonly/invalid/focus | Native checkbox with switch semantics and existing form/inline drivers; no Radix runtime. |
| `table` | `themes/tailwind/components/ui/table.blade.php` | `display/table`, columns/filters/actions and DataTables adapter; header/body/footer, selected/expanded, empty, responsive | Blade owns base table; DataTables 3 owns ephemeral controls and table driver owns behavior. |
| `tabs` | `themes/tailwind/components/ui/tabs.blade.php` | `display/{tab,tabbed}` and form tabs; active/inactive/disabled, keyboard focus, restored state | Public tabs driver owns selection/keyboard/state; no Radix tabs runtime. |
| `textarea` | `themes/tailwind/components/ui/textarea.blade.php` | textarea, inline textarea and WYSIWYG native fallback; focus/disabled/readonly/invalid/resize | Native textarea and editor adapters; consistent multiline control. |
| `tooltip` | `themes/tailwind/components/ui/tooltip.blade.php` | `_partials/tooltip` and icon/action help; hidden/open, placement, keyboard focus, reduced-motion | Public tooltip driver owns trigger/popup lifecycle; no Radix portal/runtime. |

## Existing view-to-primitive mapping

| Existing logical view group | Primary primitives/patterns | Preserved behavior boundary |
| --- | --- | --- |
| `_layout`, header, navigation, breadcrumbs, messages | sidebar, breadcrumb, dropdown-menu, badge, alert, separator, button | Blade renders the shell; sidebar/dropdown/alert drivers keep state and keyboard behavior. |
| `display`, columns, filters and actions | table, pagination, empty, checkbox, input, native-select, button-group, alert-dialog | DataTables 3/table drivers keep transport, state, selection, editing and draw lifecycle. |
| `form/card`, tabs and buttons | card, tabs, field, button, button-group | Blade keeps layout; tabs/form action drivers keep behavior. |
| scalar form elements | field, label, input, input-group, native-select, textarea, checkbox, radio-group, switch | Native submitted controls and existing validation/feature drivers remain authoritative. |
| select, related, env-editor and upload Vue islands | field, native-select, attachment, progress, dialog, button, spinner | Precompiled Vue 3 islands receive final classes through Blade props; no recipe runtime crosses the island boundary. |
| tree, gallery/lightbox, WYSIWYG and vendor popups | collapsible, button-group, dialog, tooltip, progress | Existing feature/vendor adapters retain lifecycle; recipes style only package-owned presentation. |

## Explicit exclusions

- `form`, `select`, `combobox`, `command`, `calendar`, `sonner`, `carousel`,
  `chart` and other React-specific compositions are not vendored. Existing
  native controls, Vue 3 islands, Air Datepicker, notification adapters and
  feature drivers already own those jobs.
- No `.tsx` file, React component, Radix primitive, `lucide-react` icon or
  shadcn runtime dependency is copied into the package. Font Awesome remains
  the separate `shared:icons` entry and final icon classes remain Blade-owned.
- Upstream `data-slot` names are review aids, not a second public behavior API.
  SleepingOwl keeps its documented `data-dismiss`, `data-toggle`,
  `data-widget`, form names and neutral feature hooks.

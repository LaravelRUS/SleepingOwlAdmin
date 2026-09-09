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
   deliberately into the listed active owner. Do not copy React, Radix,
   `class-variance-authority`, `lucide-react` or event/state behavior.
5. Keep SleepingOwl behavior hooks and the behavior owner in the table below;
   update this inventory, the notice when required, targeted render/browser
   contracts and prepared assets in the same checkpoint.

Composer consumers receive the resulting Blade views and prepared CSS. They
never run shadcn CLI, Tailwind content scanning or npm.

## Selected recipes and active ownership

Every recipe still refers to registry type `registry:ui`, style `new-york-v4`
and source commit `7c9eaba1c0a6404c990c144a654792e3313c650d`.
They are design inputs, not a requirement to create one Blade file per recipe.

The first implementation produced 27 component prototypes. Runtime analysis
showed that 20 had no callers and the other seven only added one indirection
around a single logical view. All useful markup, ARIA and `soa-*` hooks now
live at the real logical owners; the prototypes are preserved under
`resources/archive/unused-sources/resources/views/themes/shadcn/components`
and must not be registered, included or scanned by the build.

| Recipe group | Active owner | Runtime boundary |
| --- | --- | --- |
| alert, badge, breadcrumb, button, separator, sidebar, tooltip | `resources/views/default/_layout`, `_partials`, `helper` | Shared server markup carries legacy classes plus `soa-*`; existing feature drivers own behavior. |
| button-group, card, checkbox, field, input, input-group, label, native-select, radio-group, switch, textarea | `resources/views/default/form` and `resources/views/default/column` | Native controls and Vue islands keep names, attributes, validation and lifecycle; theme CSS styles semantic hooks. |
| table, pagination, empty, alert-dialog | `resources/views/default/display`, the four Shadcn DOM overrides and table adapters | Blade owns stable table markup; DataTables and table drivers own generated state and transport. |
| attachment, dialog, progress, skeleton, spinner | Existing form/gallery markup, Vue props and feature CSS/JS | These remain conceptual recipes; there is no generic Blade component API until multiple real callers require one. |
| collapsible, dropdown-menu, tabs | Navigation/tree/dropdown/tab logical views and public feature drivers | State and keyboard behavior stay in existing drivers; no React/Radix runtime is introduced. |

## Existing view-to-primitive mapping

| Existing logical view group | Primary primitives/patterns | Preserved behavior boundary |
| --- | --- | --- |
| `_layout`, header, navigation, breadcrumbs, messages | sidebar, breadcrumb, dropdown-menu, badge, alert, separator, button | Blade renders the shell; sidebar/dropdown/alert drivers keep state and keyboard behavior. |
| `display`, columns, filters and actions | table, pagination, empty, checkbox, input, native-select, button-group, alert-dialog | DataTables 3/table drivers keep transport, state, selection, editing and draw lifecycle. |
| `form/card`, tabs and buttons | card, tabs, field, button, button-group | Blade keeps layout; tabs/form action drivers keep behavior. |
| scalar form elements | field, label, input, input-group, native-select, textarea, checkbox, radio-group, switch | Native submitted controls and existing validation/feature drivers remain authoritative. |
| select, related and upload Vue islands | field, native-select, attachment, progress, dialog, button, spinner | Precompiled Vue 3 islands receive final classes through Blade props; no recipe runtime crosses the island boundary. |
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

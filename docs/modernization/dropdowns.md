# Dropdown migration

Dropdowns now use one delegated native controller registered through
`Admin.Components`. It does not call Bootstrap or jQuery and is shipped as the
precompiled `feature:dropdown` entry in both asset profiles. Dynamic menus,
including markup inserted after a DataTables redraw or by a custom module, do
not need per-element initialization.

## Markup

The existing public marker remains unchanged in package-owned and consumer
markup. The classes shown here still belong to the selected theme:

```html
<div class="dropdown project-actions">
    <button data-toggle="dropdown" aria-controls="project-actions-menu">
        Actions
    </button>
    <div id="project-actions-menu" class="dropdown-menu">
        <a href="/edit" class="dropdown-item">Edit</a>
    </div>
</div>
```

The menu can be resolved through `aria-controls`, `data-target="#id"`, a
same-page `href`, the next sibling, or the nearest dropdown root. The legacy
`data-toggle="dropdown"` is intentionally still the public marker rather than
being renamed. `.dropdown`, `.btn-group`, `.dropdown-menu` and `.dropdown-item`
remain the structural contract for published and custom views. No replacement
`data-dropdown*` attributes are introduced. PHP does not translate
semantic variants into theme classes; consumer attributes and classes continue
to pass through unchanged.

## State and accessibility

The driver owns `aria-haspopup`, `aria-expanded`, `hidden` and Bootstrap's
`show` and `open` state classes so existing theme CSS continues to work during
migration.

- outside click and focus close the active menu;
- only one menu is open at a time;
- clicks in form controls keep the menu open;
- Arrow Up/Down, Home and End navigate enabled items;
- Escape closes the menu and restores focus to its toggle;
- disabled, `aria-disabled="true"` and `.disabled` controls cannot open or
  receive menu navigation.

Cancelable `dropdown:show` and `dropdown:hide` events run before a transition.
`dropdown:shown` and `dropdown:hidden` run after it. All four are bubbling
`CustomEvent` instances whose detail contains `toggle`, `menu` and `root`.
Bootstrap's jQuery event API is intentionally not executed.

Legacy aggregate code exposes the same controller as `Admin.Dropdowns` with
`scan`, `open`, `close` and `toggle` methods. Custom code should normally rely
on delegated markup and native events instead of calling these methods.

## Theme ownership

Behavior and visibility belong to `feature:dropdown`. AdminLTE and Tailwind
provide independent Sass presentation adapters:

```text
feature:dropdown:theme:adminlte
feature:dropdown:theme:shadcn
```

Colors live in each adapter's `_colors.scss`, dimensions in `_variables.scss`,
and runtime overrides use `--soa-dropdown-*`. A custom theme can provide its
own adapter without replacing the native controller or rebuilding package
assets.

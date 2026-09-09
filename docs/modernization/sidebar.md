# Sidebar and navigation migration

The package sidebar now uses one native delegated controller registered through
`Admin.Components`. The precompiled `feature:sidebar` entry owns PushMenu state,
navigation-tree behavior, responsive handling and persistence without executing
AdminLTE or jQuery plugins.

## Compatibility-first markup

Existing package and consumer views keep their public markers and classes:

```html
<button data-widget="pushmenu">Menu</button>

<ul class="nav nav-sidebar" data-widget="treeview" data-accordion="false">
    <li class="nav-item menu-open">
        <a class="nav-link" href="#section">Section</a>
        <ul class="nav nav-treeview">...</ul>
    </li>
</ul>
```

No replacement `data-sidebar*` attributes are introduced. The controller
continues to use `sidebar-open`, `sidebar-collapse`, `sidebar-closed` and
`menu-open`, so published views and custom theme classes do not need a marker
migration. PHP still passes classes and attributes through without semantic
translation.

## State and accessibility

PushMenu synchronizes `aria-expanded` on every existing toggle. The theme
layout renders the established `#sidebar-overlay` inside `.wrapper`; on compact
viewports the controller shows it, closes on overlay click or Escape, and
restores focus to the toggle. JavaScript does not create presentation markup.
The explicit user preference is stored under the existing `sidebar-state`
local-storage and cookie key. A temporary responsive collapse does not
overwrite the desktop preference.

Navigation branches synchronize `aria-haspopup`, `aria-expanded`, `hidden` and
`menu-open`. Enter/Space toggle a branch; Arrow Right/Left expand, collapse and
move between levels; Arrow Up/Down plus Home/End move through visible links.
`data-accordion="false"` keeps multiple branches open.

Native `sidebar:show`, `sidebar:collapse`, `sidebar:shown`,
`sidebar:collapsed`, `navigation:expand`, `navigation:collapse`,
`navigation:expanded` and `navigation:collapsed` events bubble. The established
AdminLTE event spellings are also emitted as native custom events during the
transition, but no jQuery event API is called.

The legacy aggregate exposes the controller as `Admin.Sidebar`. Normal custom
markup needs no per-element initialization; `Admin.Sidebar.scan(root)` is
available after inserting a new tree that needs initial ARIA/hidden-state
normalization.

## Theme ownership

Behavior is shipped by `feature:sidebar`. Presentation is selected separately:

```text
feature:sidebar:theme:adminlte
feature:sidebar:theme:shadcn
```

Both Sass adapters keep colors in `_colors.scss`, dimensions in
`_variables.scss` and runtime values in `--soa-sidebar-*` properties. The
existing validated `sidebar_background_color` config override continues to set
`--soa-sidebar-bg` without rebuilding frontend assets.

The default logical owner of the overlay markup is
`default._layout.inner`. A project may override that Blade layout and change
the overlay's classes or surrounding structure while preserving the stable
`#sidebar-overlay` behavior hook. Tailwind and future custom theme layouts must
render the same hook when they enable compact PushMenu behavior.

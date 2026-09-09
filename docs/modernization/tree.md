# Tree display migration

`DisplayTree` now uses a small native controller registered through
`Admin.Components` and SortableJS 1.15. The package no longer initializes the
Nestable jQuery plugin. The controller and both theme adapters are included in
the shipped production and development profiles, so an application does not
need Node.js or a frontend rebuild.

## PHP API and rendering contract

The existing `AdminDisplay::tree()`/`DisplayTree` API remains available,
including:

- the repository, parent, order, root-parent, and tree-type configuration;
- `setMaxDepth()` and `setCollapsedLevel()`;
- `setReorderable()`;
- `setValue()` and control columns;
- `setParameters()` and `setParameter()`;
- custom HTML attributes and classes.

PHP does not translate user classes into semantic classes. User-supplied
classes and attributes pass directly to the tree host, while the selected
theme owns its standard card, controls, and presentation markup.

The stable behavior markers are:

```text
data-tree
data-tree-root
data-tree-list
data-tree-item
data-tree-handle
data-tree-action
data-tree-toggle
data-tree-toggle-expanded
data-tree-toggle-collapsed
```

`default.display.tree_children` renders each available toggle and both of its
expanded/collapsed presentation states in Blade. JavaScript does not create or
replace toggle markup: it changes `hidden`, `aria-expanded`, `aria-label` and
the item collapsed state. A leaf that can receive children keeps a hidden
toggle in the DOM, allowing drag-and-drop to reveal the same project-owned
markup when the leaf becomes a parent. Project overrides may change the tag,
classes, icons and nesting while retaining these behavior/state hooks.

Parameters are encoded with `Illuminate\Support\Js::encode()` in an inert
`application/json` script referenced by id. They are not embedded as raw JSON
inside an HTML attribute and are never executed as JavaScript.

## Reordering and depth

Every nested list has its own SortableJS instance in a group scoped to one
tree. Items can move between lists of that tree but cannot cross into another
tree. Before a move, the driver combines the target-list depth with the full
depth of the dragged branch and rejects moves that exceed `maxDepth`. It also
rejects moving an item into its own descendants.

Initial collapsed state continues to follow `setCollapsedLevel()`. Expand-all
and collapse-all controls operate only on their own tree. After a move the
controller synchronizes toggles and empty child lists without replacing the
server-rendered item content.

## Request contract and save ordering

The existing POST endpoint stays unchanged:

```text
{adminModel}/reorder
```

Requests use `Admin.Http` and preserve the existing URL-encoded field names:

```text
data[0][id]
data[0][children][0][id]
parameters[scope]
```

The controller serializes only direct child items at each level. Separate
trees keep separate state. Saves are queued per tree, so a slower earlier
request cannot overwrite a later drag with stale order.

After a successful save the host dispatches the bubbling native
`tree:changed` event with serialized `data`. The compatibility event
`display.tree::changed` remains available through `Admin.Events`. A failed
request leaves `data-tree-save-state="error"`, dispatches the bubbling
`tree:failed` event with the request error in `detail.error`.

The AdminLTE tree adapter listens to those native events and maps them to its
own localized SweetAlert policy: success is a short toast, while failure uses
`Admin.Messages.error`. It does not register or mount the tree controller, so
it may load before or after the neutral feature entry without creating a
second tree instance. Tailwind intentionally remains event-only until it owns
a notification component; it does not load SweetAlert or the AdminLTE policy.

## Theme and asset ownership

The theme-neutral `feature:tree` bundle owns lifecycle, serialization,
transport, max-depth validation, and the minimal behavior stylesheet. AdminLTE
and Tailwind each provide a separate Sass presentation adapter. Palette values
come from `_colors.scss`; dimensions and motion come from `_variables.scss`;
runtime overrides use public `--soa-tree-*` custom properties.

A custom theme can style the stable `soa-tree-*` DOM contract and listen to
`tree:changed`/`tree:failed` for its own notifications without importing
Bootstrap, AdminLTE, SweetAlert, or Tailwind and without reimplementing tree
state or transport. Code that installs the library API directly may also pass
the optional `notifications.success()`/`notifications.error(error)` dependency
to `installTrees()`.

The no-build distribution exposes these logical entries in both profiles:

```text
feature:tree
feature:tree:theme:adminlte
feature:tree:theme:shadcn
```

They resolve to precompiled JavaScript and CSS under `public/default`. The
direct `nestable2` dependency, its jQuery wrapper, and the old Nestable/panel
styles have been removed.

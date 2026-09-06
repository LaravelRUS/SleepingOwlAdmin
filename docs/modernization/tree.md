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
data-soa-tree
data-soa-tree-root
data-soa-tree-list
data-soa-tree-item
data-soa-tree-handle
data-soa-tree-action
```

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
request leaves `data-soa-tree-save-state="error"`, dispatches the bubbling
`tree:failed` event, and uses the selected theme's notification adapter.

## Theme and asset ownership

The theme-neutral `feature:tree` bundle owns lifecycle, serialization,
transport, max-depth validation, and the minimal behavior stylesheet. AdminLTE
and Tailwind each provide a separate Sass presentation adapter. Palette values
come from `_colors.scss`; dimensions and motion come from `_variables.scss`;
runtime overrides use public `--soa-tree-*` custom properties.

A custom theme can style the stable `soa-tree-*` DOM contract and provide its
own notification adapter without importing Bootstrap, AdminLTE, or Tailwind
and without reimplementing tree state or transport.

The no-build distribution exposes these logical entries in both profiles:

```text
feature:tree
feature:tree:theme:legacy-adminlte
feature:tree:theme:tailwind
```

They resolve to precompiled JavaScript and CSS under `public/default`. The
direct `nestable2` dependency, its jQuery wrapper, and the old Nestable/panel
styles have been removed.

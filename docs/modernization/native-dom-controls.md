# Native runtime assets and controls

This milestone removes jQuery and Lodash from runtime asset loading, form action buttons,
table/tree confirmation controls and table row checkboxes. The modern implementations live
under `resources/js/core` and `resources/js/shared/features`; files under
`resources/js/shared/legacy` are compatibility adapters that
only supply legacy selectors, translations and the AdminLTE row class.

## `Admin.Asset`

The public methods keep their existing names and accept one non-empty URL:

```js
await Admin.Asset.js('/admin-extension.js')
await Admin.Asset.css('/admin-extension.css')
await Admin.Asset.img('/admin-preview.svg')

await Admin.Asset.register({
    css: '/admin-extension.css',
    js: '/admin-extension.js',
})
```

Every method returns a promise that resolves to the input URL. `register()` accepts only the
`css`, `js` and `img` keys and resolves to their URLs in object insertion order. An invalid key
or empty URL is diagnosed instead of being ignored.

Concurrent JavaScript or stylesheet requests for the same absolute URL share one promise.
After the element is present in the document, another request resolves immediately without
adding a duplicate node. A failed node is removed and its pending entry is cleared, so a later
call can retry the load. URL comparison is absolute; relative and absolute spellings of the
same resource are treated as one resource.

Images are preloaded with `Image` and are not inserted into the document. Each image call is an
independent preload, matching the useful part of the legacy behavior without maintaining a
hidden global image cache.

## Form and confirmation events

Delete, destroy and restore actions create hidden POST forms with DOM methods. Parameter values
are assigned as input attributes rather than concatenated into HTML. `_token`, optional
`_method` and optional `_redirectBack` keep their current request names.

Existing event names remain available through `Admin.Events`, but event arguments are native:

| Event | Arguments |
| --- | --- |
| `datatables::confirm::submitting` | native button for form actions; native form and legacy selector for table/tree controls |
| `datatables::confirm::submitted` | the same native arguments |
| `datatables::confirm::cancel` | the same native arguments |
| `datatables::confirm::submitting::data` | mutable plain parameter object before form creation |
| `datatables::confirm::submitted::data` | the same plain parameter object after submission starts |

Code that called jQuery-only methods on an event argument must switch to `closest`, `dataset`,
`classList` or another native DOM API. This is an intentional frontend change in the new major;
the event names and positional ordering are preserved.

Both control implementations use delegated listeners. Buttons and DataTables rows inserted
after initial page boot therefore work without rebinding.

## Checkbox scope and presentation

An `.adminCheckboxAll` control changes only `.adminCheckboxRow` elements in its closest table.
Each row change exposes engine- and theme-neutral state:

```html
<tr data-selected aria-selected="true">
```

The shared table feature does not choose a visual class. The legacy adapter injects `info` to
preserve the AdminLTE appearance; another theme may inject its own class or style the neutral
attribute directly.

## Boundary of this milestone

Tooltip, tabs, Select2, date/time controls, tree drag-and-drop, inline editing, WYSIWYG and upload
components still depend on their current plugins or Vue 2 adapters. They are migrated in their
dedicated theme, DataTables and Vue milestones. Runtime asset loading and the controls described
above do not import those adapters.

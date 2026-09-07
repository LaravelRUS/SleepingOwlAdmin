# Files element runtime

`AdminFormElement::files()` keeps its PHP DSL, submitted JSON format and existing HTML contract. The runtime under that contract no longer uses jQuery or Flow.js.

## Compatibility contract

Existing theme and project views may keep these selectors and attributes:

- `.fileUploadMultiple` — component root;
- `data-target` and `data-token` — upload endpoint and form token;
- `.RenderFile` — inert uploaded-item template;
- `.files-group` and `data-draggable` — item container and reorder flag;
- `.fileBrowse`, `.fileValue`, `.fileThumbnail`, `.thumbnail` — existing controls and structure;
- `data-id="file|title|description|original_name"` — fields serialized to the hidden value;
- `.fileRemove`, `.fileLink` and `.drag-handle` — existing actions.

No replacement `data-files*` attributes are required. User classes and attributes remain untouched and are not translated by PHP.

Both the existing `<script type="text/html" class="RenderFile">` form and an HTML `<template class="RenderFile">` are accepted. The template is parsed as inert DOM and known fields are populated through DOM properties and `textContent`; response data is never executed as JavaScript or interpolated as HTML.

## Upload and lifecycle

The browser creates a hidden multiple file input inside `.fileBrowse`. Click, Enter, Space and file drop enqueue native `FormData` requests through `Admin.Http`; `_token`, same-origin credentials, CSRF headers and the existing `file` parameter name are preserved. Files selected together are uploaded and appended in selection order. The old Flow.js setup used a 1 GB chunk size and did not provide useful resumable uploads, so the dependency was removed.

The component is registered in `Admin.Components` under `files` and retains the legacy module name `form.elements.files`. Dynamic markup can be mounted idempotently with:

```js
Admin.Files.scan(container)
```

Removing dynamic markup should continue to use the shared lifecycle:

```js
Admin.Components.destroy(container)
container.remove()
```

The root emits bubbling native events:

- `files:changed` after metadata, link, remove or order changes;
- `files:uploaded` after a valid upload response is appended;
- `files:failed` after an HTTP, response or template error.

The hidden `.fileValue` continues to submit an array of `{ url, title, desc, orig }` objects as JSON. Read-only markup is synchronized without creating an uploader or Sortable instance.

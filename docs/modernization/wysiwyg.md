# WYSIWYG lifecycle

The WYSIWYG integration keeps the existing PHP element, editor names and textarea attributes while replacing its jQuery scan with `Admin.Components`.

## Preserved contract

No template migration is required. The runtime still discovers:

```html
<textarea
    id="article-body"
    data-wysiwyg-editor="ckeditor"
    data-wysiwyg-parameters='{"height":320}'
></textarea>
```

The following public behavior remains available:

- editor names `ckeditor`, `ckeditor5`, `tinymce` and `simplemde`;
- `Admin.WYSIWYG.add/register/get/switchOn/switchOff/exec`;
- compatibility module `form.elements.wysiwyg`;
- `data-wysiwyg-inited="1"` while a textarea is lifecycle-owned;
- events `wysiwyg:switchOn`, `wysiwyg:switchOff` and `wysiwyg:exec`;
- all existing `sleeping_owl.wysiwyg*` config and asset-manager settings.

Editor globals are resolved only when that editor is mounted. A page which does not load CKEditor, TinyMCE or SimpleMDE therefore continues to load the common admin bundle safely.

## Async editors and dynamic forms

The registry normalizes synchronous instances, Promise-based instances and TinyMCE-style arrays. `wysiwyg:switchOn` now fires with the resolved editor instance. CKEditor 5 and current TinyMCE can therefore be executed and destroyed reliably instead of leaving an undefined or Promise wrapper in the registry.

Dynamic form markup uses the shared lifecycle:

```js
Admin.WYSIWYG.scan(container)
```

Before removing it:

```js
Admin.Components.destroy(container)
container.remove()
```

Destroying while an async editor is still starting waits for that instance and then invokes its adapter teardown. Repeated scans are idempotent.

## Custom adapters

The callback contract is unchanged:

```js
Admin.WYSIWYG.register(
    'custom',
    (textareaId, parameters) => createEditor(textareaId, parameters),
    (editor, textareaId) => editor.destroy(),
    (editor, command, textareaId, data) => executeEditor(editor, command, data),
)
```

`switchOn()` returns a Promise resolving to the normalized editor instance. Existing callers may continue to ignore the return value; custom asynchronous integrations can await it. `Admin.WYSIWYG.editor(id)` is available when direct access to the instance or its pending Promise is needed.

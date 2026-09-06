# Table action callbacks

Named callbacks returned by bulk and form actions no longer depend on a global
jQuery object. The server response contract is unchanged:

```json
{
    "__callback": "afterArchive"
}
```

The runtime still resolves that name on `window` and invokes the function only
after a successful action response. Callback names, argument count, argument
order and error propagation remain compatible.

## Bulk actions

```js
window.afterArchive = (wrapper, checkboxes, select, message) => {
    const selectedValues = checkboxes.map((checkbox) => checkbox.value)
    select.value = '0'
    wrapper.dispatchEvent(
        new CustomEvent('archive:completed', {
            bubbles: true,
            detail: { message, selectedValues },
        }),
    )
}
```

The arguments are:

1. the native table wrapper element or `null`;
2. an array of checked native checkbox elements;
3. the native action select element or `null`;
4. the response message object.

## Form actions

```js
window.afterUpdate = (wrapper, checkboxes) => {
    wrapper?.classList.add('action-complete')
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false
    })
}
```

The arguments are the same native wrapper and checkbox array. No replacement
data attributes or theme-specific PHP mapping are involved.

## Migrating callback bodies

Only jQuery-specific operations inside a custom callback need changing. Common
equivalents are:

| Before | After |
| --- | --- |
| `$wrapper.find(selector)` | `wrapper.querySelectorAll(selector)` |
| `$checkboxes.each((_, item) => work(item))` | `checkboxes.forEach(work)` |
| `$select.val()` | `select.value` |
| `$select.val(value)` | `select.value = value` |
| `$wrapper.addClass(name)` | `wrapper.classList.add(name)` |

SleepingOwlAdmin does not ship a chainable compatibility wrapper because such a
wrapper would preserve jQuery as an undocumented public API. The native values
are stable browser APIs and work with both built-in themes and custom themes.

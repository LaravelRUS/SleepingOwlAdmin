# Select2 to Vue Multiselect migration

`Select`, `MultiSelect`, `SelectAjax`, and `MultiSelectAjax` now use the same
precompiled Vue Multiselect 3 island. The package does not initialize Select2,
import its JavaScript, or compile its CSS. This remains compatible with the
no-build consumer workflow because both Vue runtime profiles and the component
are shipped as package assets.

## PHP API

`setSelect2(true, $options)` remains available for one major transition as a
deprecated compatibility alias. It no longer changes the Blade view or adds an
`input-select` behavior class. User classes and attributes continue to pass
directly to the submitted native control.

The following raw options have bounded mappings:

| Select2 option | Vue Multiselect behavior |
| --- | --- |
| `placeholder` | Overrides the translated placeholder |
| `allowClear` | Controls whether the current value may be cleared |
| `disabled` | Disables the visible widget and submitted control |
| `tags` | Enables tagging for single or multiple selects |
| `maximumSelectionLength` | Maps to the multiple-selection maximum |
| `minimumInputLength` | Overrides `setMinSymbols()` for an AJAX select |

Plugin-specific options cannot be translated safely and produce a browser
warning instead of being silently ignored:

| Select2 option | Migration |
| --- | --- |
| `ajax` | Use `SelectAjax` or `MultiSelectAjax` |
| `multiple` | Use `MultiSelect` or `MultiSelectAjax` |
| `escapeMarkup` | Labels are rendered as text; use a custom Vue island for richer rendering |
| `templateResult` / `templateSelection` | Use a custom Vue island component |
| Other raw options | Use the Vue Multiselect API through a custom island if the standard PHP DSL is insufficient |

`disableSelect2EscapeMarkup()` is deprecated. Remote `custom_name`, `tag_name`,
and `text` values are always rendered through Vue text interpolation, so server
HTML is not executed.

Raw custom `<select class="input-select">` markup is no longer automatically
enhanced. It remains a functional native select. Package form elements render
the Vue island themselves and do not depend on a class-name scan, a tab event,
or repeated module initialization.

## AJAX contract

The existing POST endpoint and request field names are preserved:

- `q` and `page`;
- `depends`;
- `depdrop_parents[index]`;
- `depdrop_all_params[field]`.

The driver debounces input, cancels superseded requests, ignores stale
responses, reads dependency controls by exact DOM id, and uses `Admin.Http` for
CSRF and error handling. The transport, dependency reader, response normalizer,
and Vue presentation remain separate modules.

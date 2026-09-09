# Inline editor migration

Editable table columns now use a small native controller registered through
`Admin.Components`. The package no longer initializes X-editable, Moment, or
Bootstrap DateTimePicker for inline editing. The controller and both theme
adapters are included in the shipped production and development profiles, so
an application does not need Node.js or a frontend rebuild.

## PHP API and supported types

The existing editable-column DSL, readonly policy, custom modifiers, append
content, user attributes, `inline`/`popup` modes, and async-inline endpoint stay
available. The nine supported editor types are:

- `text`;
- `textarea`;
- `number`;
- `range`;
- `select`;
- `checkbox`;
- `checklist`;
- `date`;
- `datetime`.

PHP does not select presentation classes. User-supplied classes and attributes
continue to pass directly to the outer column element. The selected theme owns
the button, form, validation, and popup presentation.

Options are encoded with `Illuminate\Support\Js::encode()` in an inert
`application/json` script and referenced by id. They are not embedded as raw
JSON inside an HTML attribute or executed as JavaScript. Select and checklist
labels are rendered as text. The existing developer-owned HTML labels of the
single checkbox column remain supported.

## Request and response contract

The existing URL-encoded POST fields are preserved:

```text
name
pk
value
value[]
```

Scalar controls send `value`. Checklist and checkbox controls send one
`value[]` per checked option. Clearing every option sends an explicit empty
`value`, so an empty checklist is distinguishable from an omitted field.
Requests use `Admin.Http`, including its CSRF handling, and an active request is
cancelled with `AbortController` when the editor is destroyed or closed.

The endpoint keeps its JSON response contract:

```json
{
  "status": true,
  "newValue": "Optional display value"
}
```

An application rejection uses `status: false` and may provide `reason`.
Successful responses may omit `newValue`; PHP then reloads the stored scalar or
nested relation value. A rejected `updating` event keeps its existing failure
response, while successful updates still dispatch the `updated` model event.
Missing columns, records, and non-editable records return HTTP 404.

Laravel HTTP 422 `errors` are reduced to the first validation message and shown
inside the open editor. Server failures use the localized generic table error
instead of displaying an HTML exception page or stack trace.

## Runtime lifecycle

Each host uses `data-inline-editor` as its behavior marker. Initial pages,
DataTables redraws, tabs, and dynamic subtrees use the same idempotent
`Admin.Components.scan()` and `destroy()` lifecycle. Date and datetime editors
reuse the existing Air Datepicker component through that lifecycle rather than
creating a second date implementation. Their picker uses `click` as its show
event, so opening the editor dialog does not immediately open the calendar.

The host dispatches bubbling native `CustomEvent` instances:

- `inline-edit:opened`;
- `inline-edit:submitting`;
- `inline-edit:submitted`;
- `inline-edit:failed`;
- `inline-edit:closed`.

Event detail always contains `name` and `pk`; submitting/submitted events also
contain the relevant value, and failed contains the request error. Escape and
the localized cancel control close the editor. Closing during a request aborts
it without publishing a false failure.

The table feature listens for `inline-edit:submitted`. After the editor closes,
a client-side DataTable invalidates and redraws only the containing DOM row. A
server-side DataTable reloads its current page with `draw(false)`, preserving
pagination while allowing server-rendered columns, row classes, ordering and
filters to reflect the saved model state. Edits outside a registered DataTable
do not trigger a table refresh. Projects select the behavior globally:

```php
'datatables_settings' => [
    // 'row' invalidates the edited row; 'table' redraws the table; false disables refresh.
    'datatables_inline_edit_refresh' => 'row',
],
```

DataTables does not provide a single-record AJAX transport. Consequently,
`row` reloads the current page for a server-side table; the distinction between
`row` and `table` applies fully to client-side tables: the former invalidates
one DOM row, while the latter invalidates all DOM rows before drawing.

## Theme ownership

AdminLTE and Tailwind each provide their own Sass adapter. All palette values
come from the adapter `_colors.scss`; dimensions and motion come from
`_tokens.scss`; runtime overrides use the public `--soa-inline-editor-*`
custom properties. A custom theme can style the stable `soa-inline-*` DOM
contract without importing Bootstrap, AdminLTE, or Tailwind and without
reimplementing transport or state.

The direct dependencies `x-editable-bs4`, `bootstrap4-datetimepicker`, `moment`,
and `tempusdominus-core` have been removed. Moment and Tempus Dominus can remain
temporarily in `node_modules` only as unused transitive dependencies of the
legacy `admin-lte` package; they are not imported by the inline editor bundle.

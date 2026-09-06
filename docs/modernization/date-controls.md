# Date controls migration

`Date`, `DateTime`, `Time`, `Timestamp`, and the date/date-range table filters
now use one Air Datepicker 3.6 driver. The package no longer initializes
Bootstrap DateTimePicker or Daterangepicker and does not require Moment for
these controls. Air Datepicker JavaScript and Sass are included in both shipped
asset profiles, so application users do not need Node.js or a frontend rebuild.

## PHP and config compatibility

The existing PHP elements, filters, `setPickerFormat()` API, submitted field
names, and string values remain the public contract. The following published
config keys keep their names and behavior:

- `dateFormat`;
- `datetimeFormat`;
- `timeFormat`;
- `timezone`.

PHP still owns model conversion and timezone handling. The browser driver
reads the existing Moment-style picker format from `data-date-format`, displays
and submits that same string representation, and accepts an ISO date or
datetime as a fallback while initializing. Supported tokens cover numeric and
named months, seconds, 12/24-hour time, and bracketed literals such as `[at]`.

Package controls expose an explicit behavior marker instead of relying on a
presentation class:

```html
<input data-soa-date-control="date" data-date-format="DD.MM.YYYY">
```

The supported marker values are `date`, `datetime`, `time`, and `daterange`.
User-provided classes and attributes continue to pass through unchanged.

## Date-range attributes

The range driver preserves the submitted separator ` - ` and the existing
configuration attributes:

- `data-auto-apply`;
- `data-start-date` and `data-end-date`;
- `data-min-date` and `data-max-date`;
- `data-max-span`;
- `data-opens` and `data-drops`.

`data-max-span` accepts the existing JSON object with `years`, `months`,
`weeks`, `days`, `hours`, `minutes`, `seconds`, or `milliseconds`. Invalid or
empty optional constraints are ignored instead of preventing the control from
mounting.

## Runtime lifecycle

Date controls are registered once in `Admin.Components`. Initial and dynamic
subtrees use the same idempotent `scan`/`destroy` lifecycle, and the input-group
addon opens the owned picker instance. Disabled and readonly inputs remain
plain submitted controls and do not mount a picker.

The compatibility module names `form.elements.date`,
`form.elements.datetime`, and `form.elements.daterange` remain registered, but
they delegate to the shared component scan and do not initialize a legacy
jQuery plugin. Table date/range filters parse the same formats and listen for
native `change` events.

Moment, `bootstrap4-datetimepicker`, and `tempusdominus-core` remain temporary
direct dependencies only because the legacy X-editable adapter still imports
them. They are removed in the `X-editable/inline editor` checkpoint.

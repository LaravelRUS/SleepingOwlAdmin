# Dependent select migration

`DependentSelect` and `MultiDependentSelect` now use the same precompiled Vue
Multiselect 3 island as the other select elements. The package no longer loads
or initializes the jQuery `dependent-dropdown` plugin. The component remains
part of the shipped production and development asset profiles, so an
application using the package does not need a frontend build.

## PHP API

The existing form DSL remains available:

- `setDataDepends()` accepts either an array or a variadic list of dependency
  control ids;
- `setDataUrl()` overrides the package endpoint;
- `setInitializable(false)` prevents the initial request while keeping
  dependency-change loading enabled;
- `DependentSelect` and `MultiDependentSelect` retain their single- and
  multiple-value persistence behavior.

PHP publishes a typed `dependent` prop with `dependencies`, `initialize`, and
`url`. The package does not infer presentation semantics from PHP classes.
User-supplied classes and attributes continue to pass directly to the submitted
native select.

## Request and response contract

The existing POST payload is preserved for each dependency:

```text
depdrop_parents[index]
depdrop_all_params[id]
```

Single and array-valued dependency controls are supported. The response remains
an object with `output` and an optional `selected` value:

```json
{
  "output": [{ "id": "paris", "name": "Paris" }],
  "selected": "paris"
}
```

`output` may be either an array or a keyed object. Missing or null output is an
empty option list. When `selected` is omitted, the component reuses the original
field value if it still exists in the returned options. Malformed responses and
options are reported as load errors instead of being accepted silently.

The driver reads dependencies by exact DOM id, uses `Admin.Http` for CSRF-aware
requests, cancels superseded requests with `AbortController`, and ignores stale
responses. The visible and submitted controls stay disabled while options are
loading and after a load error.

## Lifecycle events

The old jQuery event transport is replaced by bubbling native `CustomEvent`
instances dispatched from the submitted select:

- `depdrop:init`;
- `depdrop:beforeChange`;
- `depdrop:change`;
- `depdrop:error`;
- `depdrop:afterChange`.

Event detail contains the changed dependency id/value when applicable.
`depdrop:change` additionally contains the option count and selected ids;
`depdrop:error` contains the request error. A successful option replacement also
dispatches the native bubbling `change` event.

Dynamic related form elements use the shared `Admin.Components` and `Admin.Vue`
scan/destroy lifecycle. Destroying an island removes dependency listeners and
cancels its active request; no repeated jQuery module call is required.

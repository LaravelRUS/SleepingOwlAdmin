# Runtime theme properties

## Public contract

Precompiled frontend bundles expose their runtime-adjustable values as CSS custom properties with the `--soa-*` prefix. A consumer changes supported colors through PHP config and does not need Node.js or a frontend rebuild.

The cascade order is intentional:

1. `core` publishes framework-neutral defaults;
2. each feature publishes only its `--soa-<feature>-*` defaults;
3. the selected theme assigns the shared palette and layout defaults;
4. validated runtime config is rendered after linked stylesheets and overrides both light and dark theme defaults.

Sass variables remain the source-build defaults and fallbacks. A component consumes a public property as `var(--soa-*, <Sass default>)`; it does not repeat a color literal.

## Stable property groups

| Group | Examples | Owner |
|---|---|---|
| shared palette | `--soa-primary-color`, `--soa-text-color`, `--soa-surface-color`, `--soa-border-color`, `--soa-focus-color` | core defaults, selected theme values |
| typography and motion | `--soa-font-family-sans`, `--soa-font-size-base`, `--soa-line-height-base`, `--soa-motion-duration-*` | core |
| form feature | `--soa-form-control-*`, `--soa-form-file-*` | `feature:forms` |
| table feature | `--soa-table-*` | `feature:table` |
| theme layout | `--soa-sidebar-bg`, `--soa-sidebar-*`, `--soa-content-padding`, `--soa-border-radius`, `--soa-layout-transition-duration` | selected theme |

The complete executable list is emitted by the `_custom-properties.scss` module beside each Sass entrypoint. New public properties must use the same prefix and remain owned by exactly one core/feature/theme layer.

## Color scheme

Light values are declared in `:root`. A theme changes only property values under `:root[data-soa-color-scheme="dark"]`; it does not duplicate component rules. The legacy theme keeps its existing `dark-mode` body class during migration and mirrors the selected mode to `data-soa-color-scheme` on the root element.

## Sidebar config

The optional existing-package config surface is:

```php
'sidebar_background_color' => '#102030',
```

`null` emits no override and uses the selected theme default. Supported values are hexadecimal colors, `rgb()`/`rgba()`, `hsl()`/`hsla()` and `transparent`. `CssColor` rejects other types, malformed values, custom-property expressions and CSS fragments before rendering.

`ThemeCssVariables` maps config only to allowlisted property names. The shared `sleeping_owl::shared.theme.runtime_properties` view renders the override after theme stylesheets for both light and dark selectors. Custom theme layouts should include that view in `<head>` and consume `--soa-sidebar-bg` in their own sidebar presentation; PHP does not translate or replace user CSS classes.

The legacy aggregate already consumes the property, so changing the config and running the normal cache-clear/deployment flow is sufficient. Rebuilding package assets is not required.

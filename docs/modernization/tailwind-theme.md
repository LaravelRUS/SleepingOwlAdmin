# TailwindTheme design and token contract

## Subject and job

TailwindTheme is an **operator's ledger** for backend developers and staff who
work through dense CRUD tables, forms, navigation and operational states for
hours at a time. Its single job is to make the current record, state and next
safe action obvious without hiding data behind decorative UI.

This is not a marketing dashboard. It has no hero, gradient wash, glass card
or ornamental chart. Information density, stable alignment and clear
selection/error states take priority over visual novelty.

## Direction

The theme uses quiet, cool work surfaces and an ink-like navigation shell.
Color is reserved for actions and state. Corners are compact rather than
pill-heavy, shadows separate transient layers only, and tables may use the
full content width.

The deliberate visual risk is the **ledger rail**: a three-pixel
`border-inline-start` signal shared by the active navigation branch, selected
record, validation summary and status message. The rail always encodes current
context or severity; it is never added as decoration. Its alignment makes the
operator's position scannable from navigation through content and works in
both LTR and RTL layouts.

```text
┌───────────────┬──────────────────────────────────────────────┐
│ navigation    │ breadcrumb / page title             actions │
│ ▌active group ├──────────────────────────────────────────────┤
│   item        │ ▌status or validation summary               │
│   item        │                                              │
│               │ filters / toolbar                            │
│               │ ▌selected row  data  data  action            │
│               │   row           data  data  action            │
└───────────────┴──────────────────────────────────────────────┘
```

## Core palette

| Name | Value | Job |
| --- | --- | --- |
| Ledger ink | `#142033` | primary text and high-confidence information |
| Work surface | `#f4f7fb` | page canvas behind white/elevated work areas |
| Signal cobalt | `#2457d6` | primary action, focus and current-context rail |
| Verified teal | `#0f766e` | successful or verified state, never generic decoration |
| Caution amber | `#a85d00` | recoverable warning and attention state |
| Fault red | `#b42318` | destructive action, invalid state and failure |

All light and dark derivatives live only in
`resources/css/themes/shadcn/_colors.scss`. Dark mode uses deep
navy work surfaces rather than pure black and raises chroma/luminance for
status colors. Components consume semantic custom properties, never literals.

## Typography and density

- Interface and headings use the platform-native stack `Aptos`,
  `Segoe UI Variable`, `Segoe UI`, `system-ui`. This choice keeps Latin,
  Cyrillic and application locales crisp without a font download or a larger
  Composer artifact.
- IDs, timestamps, compact metrics and code-like values use `Cascadia Mono`,
  `SFMono-Regular`, `Consolas`, `Liberation Mono`, `monospace`.
- Body copy is `14px/1.5`; dense data is `13px`; captions are `12px`.
  Page titles are `24px/1.25`, section titles `18px/1.25`, weight `600` and
  `-0.012em` tracking. Uppercase is limited to genuine abbreviations.
- The spacing rhythm is 4px-based. Controls target a compact 36px default;
  hit areas expand where touch input needs them. Content padding drops from
  20px to 14px on compact viewports.

No external font dependency is permitted. Typography is intentionally quiet
so the ledger rail and the data, not a display typeface, carry identity.

## Shape, depth and motion

- Default radius is 6px, with 4px compact and 8px elevated variants. Pills are
  limited to badges/statuses where the closed shape has semantic value.
- Borders organize persistent surfaces. Shadows are limited to dropdowns,
  dialogs, tooltips and other transient elevation.
- State transitions use 100/160/220ms durations and only opacity, transform or
  bounded disclosure dimensions. `prefers-reduced-motion` will collapse them
  to the published reduced-motion duration.
- Keyboard focus uses a two-pixel cobalt ring with sufficient separation from
  borders. Color never carries state alone; icon/text/ARIA or selection shape
  remains present.

## Token ownership

| Layer | Owner | Rule |
| --- | --- | --- |
| Color literals | `_colors.scss` | light/dark palette and overlay/shadow color only |
| Type, spacing, radius, geometry, motion | `_variables.scss` | build-time defaults with `!default` |
| Public runtime contract | `_custom-properties.scss` | canonical `--soa-*` values and dark overrides |
| shadcn/Tailwind bridge | `_shadcn-theme.scss` | aliases `--color-*`, font, radius and shadow roles to `--soa-*`; no independent values |
| Components/features | theme and feature SCSS | consume semantic variables; may not define palette literals |

Key aliases are deliberately one-way:

| shadcn/Tailwind role | Canonical SleepingOwl token |
| --- | --- |
| background / foreground | `--soa-page-background-color` / `--soa-text-color` |
| card / popover | `--soa-surface-color` / `--soa-elevated-surface-color` |
| primary / ring | `--soa-primary-color` / `--soa-focus-color` |
| secondary / muted | `--soa-muted-surface-color` / `--soa-muted-text-color` |
| accent | `--soa-accent-surface-color` |
| destructive | `--soa-danger-color` |
| border / input | `--soa-border-color` / `--soa-input-border-color` |
| sidebar roles | `--soa-sidebar-*` |

The bridge does not make shadcn variable names a second public customization
API. Application settings and inline runtime validation continue to write only
documented `--soa-*`, including `--soa-sidebar-bg`.

## Selection contract

The public config selects the built-in theme by name without a consumer build:

```php
'template' => [
    'default' => 'shadcn',
    'themes' => [
        'adminlte' => SleepingOwl\Admin\Themes\AdminLTETheme::class,
        'shadcn' => SleepingOwl\Admin\Themes\TailwindTheme::class,
    ],
],
```

`TailwindTheme` directly implements `ThemeInterface`. The transitional
`ThemeTemplateAdapter` composes its runtime through `ThemeRuntimeAssets`, so
the class declares only shared dependencies and `theme:shadcn`; package
feature drivers are not repeated in theme metadata. Until their presentation
checkpoints close, no Tailwind feature adapter or capability is declared.

The theme owns the `sleeping_owl_shadcn::default` Blade namespace with ordered
package roots: `resources/views/themes/shadcn`, then `resources/views`. The
theme directory contains only one structural shell override; the other 135
logical views inherit the complete 136-view package base in
`resources/views/default`. That base carries both legacy compatibility classes
and stable `soa-*` semantic hooks. The former 27 component prototypes are
archived and are not runtime views. Relative logical view names remain
unchanged, and an application override under
`resources/views/vendor/sleeping_owl_shadcn` precedes both roots. An external
package can use the existing `ThemeRegistry` service-provider hook documented
in `theme-customization.md`; it does not receive this built-in fallback
implicitly.

Invalid classes, malformed metadata and missing logical assets raise the
existing diagnostic exceptions. There is no fallback to `AdminLTETheme`.

## Maintainer build and distribution

Tailwind `4.3.3` and `@tailwindcss/postcss` `4.3.3` are exact, lockfile-backed
development dependencies. They are not browser dependencies and are not needed
by Composer consumers. `tailwind.input.css` loads only the utilities layer—no
preflight—and limits source discovery to the Tailwind theme namespace. Its
`tailwind.config.cjs` uses `tailwind.preset.cjs`, whose colors, fonts, radii and
shadows resolve to canonical `--soa-*` properties.

The scanner reads the single physical Shadcn override. Inherited base files use
stable semantic/theme CSS; the generated utility snapshot does not depend on
discovering legacy class strings in the base tree. The
fallback migration first removed the false-positive `.static` utility produced
from a Blade `static fn`; no rendered `static` class existed. After semantic
consolidation, the generated layer contains only the explicitly sourced
`flex`/`grid` utilities. A future inherited view that is the sole source of a
required utility must add an explicit source contract test instead of scanning
the whole base tree. The prepared utility layer is 122 bytes in production and
202 bytes in development; the complete `soa-*` presentation remains in
`shadcn.css`.

The build matrix publishes two files under the single logical
`theme:shadcn` entry:

```text
css/themes/shadcn.css
css/themes/shadcn-utilities.css
```

The first is the handwritten Sass/token layer; the second is generated and is
never edited manually. `npm run production` builds and checksums both
production and development profiles. `php artisan sleepingowl:update` copies
those ready files, so selecting TailwindTheme or changing asset profile never
runs Tailwind, PostCSS or a content scan in the application.

## Design check

The first pass risked becoming a generic blue Tailwind admin. The retained
revision spends distinctiveness in one functional device—the aligned ledger
rail—and removes ornamental gradients, oversized statistics, custom webfonts
and widespread shadows. That keeps the theme recognizably operational while
preserving no-build delivery, localization and long-session readability.

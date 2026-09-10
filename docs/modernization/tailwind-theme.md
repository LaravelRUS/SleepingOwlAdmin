# Built-in Tailwind theme

## Purpose and selection

`TailwindTheme` is the package's CSS-only Tailwind 4 presentation. It is aimed
at administrators working with dense tables and long forms: a cool, low-noise
workbench with one warm “duty mark” on the active navigation item. The light
palette uses a mist canvas, ink sidebar and periwinkle actions; dark mode keeps
the same hierarchy instead of simply inverting the page.

Select the ready theme without a frontend build:

```dotenv
SLEEPINGOWL_TEMPLATE=tailwind
```

Then publish the package assets during deployment as usual:

```bash
php artisan sleepingowl:update
```

Both production and development profiles are shipped in the Composer package.
Node.js, Vite and Tailwind are maintainer dependencies, not application runtime
requirements.

## Build boundary

The exact maintainer dependencies are `tailwindcss@4.3.3` and
`@tailwindcss/postcss@4.3.3`. Vite invokes the Tailwind PostCSS plugin only for
`resources/css/themes/tailwind/theme.css`; other package styles keep their
existing Sass/PostCSS pipeline.

The theme imports Tailwind's theme and utility engines with the `tw` prefix and
does not import Preflight. That protects inherited SleepingOwl/legacy class
names such as `collapse`, `table` and `border` from accidental utility
collisions. Tailwind utilities are compiled into the theme's own component
recipes with `@apply tw:*`; the distributed bundle does not promise arbitrary
application utility classes. Applications that need additional utilities own
their own Tailwind content scan and CSS entry.

## Presentation contract

The theme reuses the canonical package Blade views through the sparse
`sleeping_owl_tailwind` namespace. Its source owns only presentation:

- light and dark values for the public `--soa-*` token contract;
- typography, surfaces, controls, table headings and focus treatment;
- the active-navigation duty mark;
- Tailwind-generated declarations used by the theme recipes.

All behavior remains in the shared native feature drivers and Vue 3 islands.
The selected page loads no Bootstrap, AdminLTE, Tabler or theme-owned JavaScript.
Font Awesome remains the package's shared icon boundary.

Application Blade overrides belong at:

```text
resources/views/vendor/sleeping_owl_tailwind/default/<logical path>
```

Application CSS loads after the package theme and can override documented
`--soa-*` properties. `sidebar_background_color` remains the supported
configuration-to-CSS shortcut.

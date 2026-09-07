# Lightbox migration

Image previews now use GLightbox 3.3.1 through a small native controller
registered with `Admin.Components`. The package no longer initializes
Magnific Popup or a jQuery document delegate. The controller and both theme
adapters are included in the shipped production and development profiles, so
an application does not need Node.js or a frontend rebuild.

## Markup contract

Package-owned image columns, Gravatar columns, the single-image Vue island,
and the legacy multiple-file element use the stable behavior marker:

```html
<a href="/images/full.jpg" data-lightbox>
    <img src="/images/thumbnail.jpg" alt="Preview" />
</a>
```

The controller reads the full image URL from `href`, the accessible image text
from the nested image `alt`, and an optional caption from `data-title` or
`title`. Captions are HTML-escaped before they reach GLightbox, which otherwise
inserts its title through `innerHTML`; user content is rendered only as text.

The previous `data-toggle="lightbox"` marker remains a deprecated compatibility
selector for existing published/custom views. New markup should use only
`data-lightbox`; PHP does not generate framework-specific classes or map
user classes.

## Dynamic content and galleries

One delegated controller is mounted on the document through the body lifecycle
record. Consequently, links inserted by DataTables, Vue islands, related
elements, or legacy upload templates work immediately without a plugin reload
or direct jQuery call. Destroying the lifecycle record removes the listener and
destroys an open GLightbox instance; a later `Admin.Components.scan()` mounts
it again idempotently.

An ungrouped link opens as a single image, preserving the old behavior. Links
with the same non-empty `data-gallery` value form one gallery in document order:

```html
<a href="/images/one.jpg" data-lightbox data-gallery="product"></a>
<a href="/images/two.jpg" data-lightbox data-gallery="product"></a>
```

The grouping is resolved when the user clicks, so newly inserted links are
included. Normal modified clicks with Ctrl, Command, Shift, or Alt are not
intercepted and retain the browser's link behavior.

## Events

The clicked link dispatches bubbling native `CustomEvent` instances:

- `lightbox:opened` after GLightbox opens;
- `lightbox:closed` after it closes.

Event detail contains the clicked `trigger`, its zero-based `index`, and the
gallery `size`. This is the public extension boundary; custom code should not
access GLightbox internals.

## Theme and asset ownership

The theme-neutral `feature:lightbox` bundle owns GLightbox, delegated behavior,
gallery discovery, lifecycle, events, vendor base CSS, and the SVG sizing fix.
AdminLTE and Tailwind each provide a separate Sass presentation adapter for
controls and captions. Palette values come from `_colors.scss`; dimensions and
motion come from `_variables.scss`; runtime overrides use public
`--soa-lightbox-*` custom properties.

A custom theme can load `feature:lightbox`, style the GLightbox DOM with the
public custom properties, and omit both built-in theme adapters.

Both no-build profiles expose these logical entries:

```text
feature:lightbox
feature:lightbox:theme:legacy-adminlte
feature:lightbox:theme:tailwind
```

They resolve to precompiled JavaScript and CSS under `public/default`. The
direct `magnific-popup` dependency, jQuery wrapper, and legacy component
stylesheet have been removed.

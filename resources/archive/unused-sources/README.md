# Unused resource sources

This directory preserves source files that are not reachable from any active
Laravel Mix entrypoint and are not part of a supported source import boundary.
Paths below this directory mirror their former package-relative location.

Archived during the resource-layout migration:

- the unused AdminLTE table tooltip bridge; the active tooltip feature owns
  tooltip scanning and rendering;
- seven Open Sans variants that are not referenced by either the legacy or
  theme stylesheet (Bold, Italic and Regular remain active);
- the redundant Tailwind view `.gitkeep` from a non-empty directory.
- the unused shared sidebar color placeholder; its `$surface`/`$text`
  variables were imported but never consumed or emitted into CSS;
- 27 experimental Shadcn Blade primitives/patterns. Their useful semantic
  `soa-*` hooks now live directly in the shared `resources/views/default`
  markup; the prototypes had no remaining runtime callers and are retained
  only as design reference.
- eight retired `default.*` Blade bridges. Runtime owners now point directly
  to their `shared.*` or `features.*` views, so the extra include layer and its
  historical logical paths are no longer active in this breaking release.
- seven class-only control/card adapters. Their PHP owners now select the
  variant classes and render one control or card-part Blade implementation.
- four nearly identical message views, replaced by one message template whose
  widget supplies alert classes, icon, role and session key.
- four duplicate scalar column views, replaced by one value template with an
  explicit escaped/raw value contract supplied by the column class.

Nothing under `resources/archive` may be imported or compiled.

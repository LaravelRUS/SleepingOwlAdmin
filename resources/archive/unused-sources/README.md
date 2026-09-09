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

Nothing under `resources/archive` may be imported or compiled.

# Legacy JavaScript global boundary

First-party legacy JavaScript is part of the ESLint gate even while individual plugin adapters
still await migration. The checked scope contains the aggregate entry files plus `admin`,
`components` and `wysiwyg`; copied or wrapped third-party sources under `libs` are excluded.

`no-undef`, `no-global-assign` and `no-implicit-globals` are mandatory for this boundary. Browser
APIs and current compatibility globals such as `Admin`, `Vue`, jQuery, Lodash and concrete editor
runtimes are listed explicitly as read-only in `eslint.config.mjs`. The allowlist documents an
existing adapter dependency; it does not permit a module to create another global or add one to
core.

The initial guarded pass removed all discovered accidental globals:

- tab persistence now keeps its storage key, restored values and parsed map in lexical scope;
- Vue env editor iteration and Select2 dependency iteration declare their keys;
- clipboard confirmation keeps its extension and cleanup element local to their callbacks;
- the env editor uses the valid `String` Vue prop constructor instead of an unresolved `Text`;
- custom action feedback calls the configured `Swal.fire` runtime instead of an undeclared
  lowercase alias;
- `urlName` and `activeFilters` had already disappeared with table feature decomposition.

The lint command names the legacy roots directly, so this protection runs in `npm run lint`,
`npm run check` and CI. Removing an external runtime later also requires removing its global from
the allowlist; otherwise the boundary would hide a stale dependency.

This milestone does not make plugin adapters headless. Their declared jQuery, Bootstrap, Select2,
date/time, tree and editor globals remain compatibility dependencies until their dedicated
feature/theme migrations.

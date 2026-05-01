# SleepingOwl Admin Architecture

SleepingOwl Admin is a modular administrative interface builder for Laravel.

## Project Structure (Core Logic)

The following structure highlights the directories essential for analyzing business logic:

```text
/config/                # Package configuration (navigation, admin panels)
/public/                # Compiled assets (managed via Webpack Mix)
/resources/             # Frontend source code (JS, SASS) and Blade templates
/src/                   # Core PHP business logic
  ├── Admin.php         # Central registry
  ├── Section.php       # Model-to-UI mapping
  ├── Display/          # UI components (tables, trees, tabs)
  ├── Form/             # CRUD form building logic
  ├── Navigation/       # Menu structure definition
  ├── Model/            # Model configuration management
  ├── Providers/        # Service providers for package lifecycle
  └── Routing/          # Model-based routing system
```

## Logic Analysis - Key vs. Ignored

### Essential for Logic Analysis
- **`src/Admin.php`**: The primary entry point and singleton registry for models and sections.
- **`src/Section.php` & `src/Model/`**: Handles the mapping of Eloquent models to admin sections.
- **`src/Display/` & `src/Form/`**: Contains the core logic for rendering data grids (datatables, trees) and CRUD forms.
- **`src/Routing/`**: Orchestrates how models are associated with admin routes.

### Ignored (Contextual/Infrastructure)
- **`tests/`**: Unit and integration tests.
- **`config/`**: Configuration files.
- **`resources/` (JS/SASS)**: Frontend styling and interactivity implementation.
- **`vendor/` & `node_modules/`**: Third-party dependencies.
- **`public/`**: Compiled, generated assets.
- **Documentation/Meta-files**: `CHANGELOG.md`, `CLAUDE.md`, etc.

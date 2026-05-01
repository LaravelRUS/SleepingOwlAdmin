# SleepingOwl Admin - Laravel Admin Panel

## Overview

SleepingOwl Admin is an administrative interface builder for Laravel. It provides a complete CRUD scaffolding system for managing Eloquent models through an admin panel.

**Repository:** https://github.com/LaravelRUS/SleepingOwlAdmin
**Documentation:** https://sleepingowladmin.ru

## Tech Stack

- **PHP:** >= 8.1
- **Laravel:** >= 10
- **Key Dependencies:**
  - `spatie/laravel-html` - HTML building
  - `doctrine/dbal` - Database abstraction
  - `diglactic/laravel-breadcrumbs` - Breadcrumbs

## Architecture

### Core Entry Point

`SleepingOwl\Admin\Admin` (`src/Admin.php`) is the main application class that:
- Manages model configurations (registered sections)
- Handles navigation and template rendering
- Acts as the central facade (`sleeping_owl` alias)

### Model Configuration

Model configuration is the primary way to define admin sections:

```php
Admin::model(ModelClass::class)->section(function($section) {
    $section->configure(function($config) {
        $config->setTitle('Title');
    });
    $section->onDisplay(function($display) { /* ... */ });
    $section->onCreate(function($form) { /* ... */ });
    $section->onEdit(function($form) { /* ... */ });
});
```

**Key Classes:**
- `ModelConfiguration` (`src/Model/ModelConfiguration.php`) - Per-model configuration with lifecycle hooks
- `ModelConfigurationManager` (`src/Model/ModelConfigurationManager.php`) - Base configuration logic
- `SectionModelConfiguration` (`src/Model/SectionModelConfiguration.php`) - Section-based variant

### Directory Structure

```
src/
├── Admin.php                    # Main entry point
├── AliasBinder.php              # Class alias binding
├── Navigation.php               # Navigation container
├── Configuration/              # Configuration traits
├── Console/Commands/           # Artisan commands (install, update, etc.)
├── Contracts/                   # Interface definitions
│   ├── Display/                 # Display column/form contracts
│   ├── Form/                    # Form element contracts
│   └── Navigation/             # Navigation contracts
├── Display/                     # Table/Tree display classes
│   ├── Column/                  # Column types (Text, Image, Boolean, etc.)
│   ├── Column/Editable/         # Inline-editable columns
│   ├── Column/Filter/          # Column filter types
│   ├── Extension/               # Display extensions (columns, filters)
│   └── Tree/                   # Tree display components
├── Facades/                     # Laravel facades
├── Form/                        # Form elements
│   ├── Element/                 # Form input types
│   ├── Buttons/                 # Form button types
│   ├── Card/                    # Card layout components
│   ├── Columns/                 # Multi-column form layouts
│   └── Related/                # Related model forms
├── Http/
│   └── Controllers/            # Admin controllers
├── Model/                       # Model configuration classes
├── Navigation/                  # Navigation components
├── Providers/                   # Service providers
├── Repositories/                # Data access layer
├── Templates/                   # Template rendering
├── Traits/                      # Reusable traits
└── Widgets/                      # Reusable widgets
```

### Display System

`SleepingOwl\Admin\Display\DisplayTable` is the primary table display class. It renders paginated data tables with:
- Column definitions via `Columns` extension
- Column filters via `ColumnFilters` extension
- Search functionality
- Pagination

Other display types:
- `DisplayDatatablesAsync` - Async DataTables
- `DisplayTree` - Hierarchical tree display
- `DisplayTabbed` - Tabbed interface
- `DisplayTab` - Single tab display

### Form System

Forms are built from `FormElement` instances composed into:
- `FormDefault` - Standard form
- `FormTabbed` - Tabbed form layout
- `FormCard` - Card-based layout

Form elements live in `src/Form/Element/` and include:
- Text, Textarea, Select, MultiSelect
- Checkbox, Radio
- Date, DateTime, Time
- Image, File upload
- Wysiwyg editors

### Contracts (Interfaces)

The codebase uses contracts for dependency inversion:
- `DisplayInterface` - Display renderers
- `FormInterface` / `FormElementInterface` - Form components
- `ModelConfigurationInterface` - Model config
- `ColumnInterface` - Table columns
- `NavigationInterface` / `PageInterface` - Navigation

### Service Providers

- `SleepingOwlServiceProvider` - Main provider, registers config/views
- `AdminServiceProvider` - Registers admin services
- `AliasesServiceProvider` - Registers class aliases
- `BreadcrumbsServiceProvider` - Breadcrumb handling

### Configuration

`config/sleeping_owl.php` contains all settings:
- `url_prefix` - Admin URL prefix (default: `admin`)
- `middleware` - Applied middleware
- `template` - Template class
- `bootstrapDirectory` - Where section config files live
- `wysiwyg` - WYSIWYG editor configuration

## Conventions

### Class Naming

- Display columns: `SleepingOwl\Admin\Display\Column\*` (e.g., `Text`, `Image`, `Boolean`)
- Form elements: `SleepingOwl\Admin\Form\Element\*` (e.g., `Text`, `Select`, `Checkbox`)
- Editable columns: `SleepingOwl\Admin\Display\Column\Editable\*` (e.g., `Text`, `Select`)

### Model Section Registration

Models are registered in `app/Admin/bootstrap.php`:

```php
use SleepingOwl\Admin\Admin;

Admin::model(\App\Models\User::class)->section(function($section) {
    $section->onDisplay(function($display) {
        $display->addColumns([...]);
    });
    $section->onCreate(function($form) {
        $form->pushElements([...]);
    });
    $section->onEdit(function($form) {
        $form->pushElements([...]);
    });
});
```

### Facade Aliases

Configured in `config/sleeping_owl.php['aliases']`:
- `AdminSection` → `Admin::class`
- `AdminColumn` → `TableColumn::class`
- `AdminForm` → `Form::class`
- etc.

### Extension Pattern

Display and form elements use an extension pattern:
```php
$display->extend('columns', new Columns());
$display->extend('column_filters', new ColumnFilters());
```

Extensions can modify queries, alter rendering, etc.

## Testing

- **Framework:** PHPUnit >= 7.0
- **Testbench:** Orchestra Testbench >= 3.5
- **Mockery:** For mocking dependencies

Run tests: `./vendor/bin/phpunit`

## Installation

```bash
composer require laravelrus/sleepingowl:8.*
php artisan sleepingowl:install
```

## Key Files

| File | Purpose |
|------|---------|
| `src/Admin.php` | Main entry point |
| `src/Model/ModelConfiguration.php` | Per-model admin config |
| `src/Display/DisplayTable.php` | Table display |
| `src/Form/FormDefault.php` | Default form |
| `config/sleeping_owl.php` | Configuration |
| `resources/views/` | Blade templates |
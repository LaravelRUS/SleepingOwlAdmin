# SleepingOwl Admin

SleepingOwl Admin is a powerful, flexible, and completely free administrative interface builder for the Laravel framework. It allows developers to quickly create CRUD interfaces for their database models with minimal effort.

## Project Overview

-   **Type:** Laravel Package (Administrative Interface Builder)
-   **Main Technologies:** 
    -   PHP 8.1+
    -   Laravel 10+
    -   Vue.js (Frontend components)
    -   SASS (Styling)
    -   Webpack Mix (Asset compilation)
-   **Architecture:**
    -   **Admin Core (`src/Admin.php`):** The central registry for models, sections, and navigation.
    -   **Sections:** Define the admin interface for specific models.
    -   **Templates:** Customizable UI templates (default is based on AdminLTE).
    -   **Service Providers:** `SleepingOwlServiceProvider` handles the package's integration with Laravel.

## Building and Running

### Prerequisites
-   PHP 8.1+
-   Composer
-   Node.js & NPM (for asset compilation)

### Installation
1.  Install via Composer:
    ```bash
    composer require laravelrus/sleepingowl:8.*
    ```
2.  Install SleepingOwl assets and configuration:
    ```bash
    php artisan sleepingowl:install
    ```

### Asset Management
Assets are located in `resources/assets` and compiled to `public/default` using Laravel Mix.
-   **Install Dependencies:** `npm install`
-   **Development Build:** `npm run dev`
-   **Production Build:** `npm run prod`
-   **Watch for Changes:** `npm run watch`

### Testing
The project uses PHPUnit and Orchestra Testbench for testing.
-   **Run Tests:** `./vendor/bin/phpunit`
-   **Test Configuration:** `phpunit.xml`
-   **Base Test Class:** `tests/TestCase.php`

## Development Conventions

-   **Namespacing:** Follows PSR-4 (`SleepingOwl\Admin\` maps to `src/`).
-   **Facades:** Provides several facades for easy access to core components (e.g., `AdminSection`, `AdminDisplay`, `AdminForm`).
-   **Configuration:** Main configuration file is `config/sleeping_owl.php`.
-   **Sections:** New admin sections should be registered in `app/Providers/AdminSectionsServiceProvider.php` (in the consumer application) or via the `Admin` facade.
-   **Translations:** Supports multiple languages, located in `resources/lang`.
-   **Views:** Blade templates are located in `resources/views`.

## Key Directories
-   `src/`: Core PHP source code.
-   `resources/assets/`: Frontend source files (JS, SASS).
-   `resources/views/`: Blade templates for the admin interface.
-   `resources/lang/`: Translation files.
-   `config/`: Default package configuration.
-   `public/`: Compiled assets (managed via Webpack Mix).

## Lead Developer's Architectural Analysis (June 2026)

### Core & Registration
*   **Central Hub:** The `Admin` class acts as the registry for models (sections) and manages component aliases.
*   **Flexible Initialization:** Uses the `AliasBinder` pattern, allowing developers to extend functionality by overriding standard element classes.
*   **Laravel Integration:** Deeply integrated via service providers, utilizing the container (DI) for injecting dependencies into section closures.

### CRUD Engine
*   **Section Pattern:** Model interfaces are defined via `ModelConfiguration`, allowing for declarative UI descriptions while keeping logic in closures fired on demand.
*   **Repositories:** `RepositoryInterface` abstracts data handling from Eloquent, providing uniform processing (including Soft Deletes).
*   **Fluent API:** Factories provide a convenient interface for building complex tables and forms.

### Request Handling
*   **Universal Controller:** `AdminController` handles most actions via the `{adminModel}` dynamic parameter.
*   **Lifecycle:** Resolves section configuration, initiates UI object construction, and passes it to the rendering layer.
*   **Inline Editing:** Supports X-editable via `inlineEdit`, mapping columns to the `Display` object for updates.

### Rendering Layer
*   **Recursive Saving:** `FormDefault` automatically handles validation and saving for related models (`BelongsTo`, `HasOneOrMany`).
*   **Extensions:** Tables support a system of extensions for column filters, totals, etc., allowing for modular functional growth.

### Evaluation & Tech Debt
*   **Strengths:** High extensibility, clean Fluent API, solid data abstraction.
*   **Risks:** `AdminController` is overloaded with diverse responsibilities (breadcrumbs, `.env` editing, CRUD). Direct `.env` file manipulation via regex is risky. Legacy Laravel version checks and patterns should be refactored for simplicity.


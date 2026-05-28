# SleepingOwl Admin Architecture

SleepingOwl Admin is a powerful, modular administrative interface builder for the Laravel framework. It follows a decoupled design, leveraging Laravel's Service Providers, Facades, and a custom "Alias Binder" system to provide a fluent and extensible API for building CRUD interfaces.

---

## 1. Core Architecture & Lifecycle

### Central Registry (`src/Admin.php`)
The `Admin` class is the heart of the system. It acts as a singleton registry that stores:
-   **Model Configurations:** Maps between Eloquent models and their administrative interfaces (Sections).
-   **Templates:** The current UI template implementation.
-   **Navigation:** The global navigation tree.
-   **Meta Information:** Global page titles and assets.

### Service Providers (`src/Providers/`)
The package lifecycle is managed by several service providers:
-   **`SleepingOwlServiceProvider`**: Handles core initialization, configuration merging, and registering the main `Admin` class in the container.
-   **`AdminServiceProvider`**: Orchestrates high-level tasks: route registration, template initialization, loading the `navigation.php` file, and registering global widgets.
-   **`AliasesServiceProvider`**: Registers facades (e.g., `AdminSection`, `AdminFormElement`) which provide a fluent API for developers.
-   **`AdminSectionsServiceProvider`**: Intended for user applications to register their own sections and policies.

---

## 2. Navigation System (`src/Navigation/`)

The navigation system builds a hierarchical menu structure.
-   **`Navigation`**: The container for the entire menu tree. It handles finding the active item and filtering items based on access logic.
-   **`Page` (`src/Navigation/Page.php`)**: Represents a single menu item. 
    -   Can be linked to a specific model or a custom URL.
    -   Supports nested children (tree structure).
    -   Handles icon, priority, and access control.
    -   *Recent updates:* Supports Closures for almost all properties (title, icon, url, priority, target, active) for dynamic behavior.

---

## 3. Model & Section Logic (`src/Model/`, `src/Section.php`)

Developers define the admin interface for their models using **Sections**.
-   **`ModelConfiguration`**: Defines the behavior for a model (title, icon, URL aliases, policies). It can be configured using Closures in the main `Admin` registration.
-   **`Section`**: A class-based alternative to the Closure approach. Developers extend this class to define:
    -   `onDisplay()`: Returns the table or grid to show records.
    -   `onCreate()`: Returns the form to create a record.
    -   `onEdit()`: Returns the form to edit a record.
    -   `onDelete()`: Custom logic for deletion.
-   **`ModelConfigurationManager`**: Handles the internal management of these configurations and their associated Eloquent models.

---

## 4. Routing & Request Handling (`src/Routing/`, `src/Http/Controllers/`)

### Dynamic Routing (`src/Routing/ModelRouter.php`)
SleepingOwl uses a specialized router to handle dynamic model-based URLs (e.g., `/admin/users/1/edit`).
-   The `ModelRouter` binds the `{adminModel}` parameter in routes to the corresponding `ModelConfiguration` object.
-   It supports **Custom Controllers**: If a section defines a custom controller class, the `ModelRouter` redirects the request to that controller instead of the default one.

### Default Controller (`src/Http/Controllers/AdminController.php`)
The `AdminController` is the primary handler for all CRUD operations. It:
-   Identifies the model and section from the route.
-   Validates permissions (using Laravel Gates).
-   Fetches data from repositories.
-   Renders the appropriate component (Display or Form).
-   Wraps the output in the current Template layout.

---

## 5. UI Component System (`src/Factories/`, `src/AliasBinder.php`)

UI components (like table columns or form elements) are created using a factory system.
-   **`AliasBinder`**: A core trait/class that maps short aliases (e.g., 'text', 'select') to full class names.
-   **Factories**: Specific registries for components:
    -   `DisplayFactory`: Tables, Tabs, Trees.
    -   `DisplayColumnFactory`: String columns, Images, URLs, Edits.
    -   `FormFactory`: Default forms, Tabbed forms.
    -   `FormElementFactory`: Text inputs, Selects, CKEditor, Dates.
-   This system allows for the fluent API used in sections: `AdminFormElement::text('name', 'User Name')`.

---

## 6. Frontend & Template Layer (`src/Templates/`)

The package is designed to be theme-agnostic.
-   **`TemplateInterface`**: Defines the contract that all templates must follow (loading assets, rendering pages, managing breadcrumbs).
-   **`Assets`**: Manages JS and CSS dependencies.
-   **`Meta`**: Manages HTML meta tags and page titles.
-   **Views**: Blade templates are located in `resources/views/default`. They are organized into `_partials/navigation`, `column`, `form`, etc.

---

## 7. Key Directories Overview

```text
/src/
  ├── Admin.php         # Central registry
  ├── AliasBinder.php   # Factory alias mapping logic
  ├── Section.php       # Base class for UI sections
  ├── Display/          # Logic for displaying data (tables, columns, filters)
  ├── Form/             # Logic for CRUD forms and elements
  ├── Navigation/       # Menu tree and Page implementation
  ├── Routing/          # Dynamic model route binding
  ├── Factories/        # Registry for UI components (FormElement, DisplayColumn)
  ├── Providers/        # Service providers for package integration
  ├── Http/             # Routes and the main AdminController
  ├── Model/            # Internal model configuration management
  └── Templates/        # Abstract UI template layer
```

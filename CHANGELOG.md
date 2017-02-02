# Release Notes

## [Unreleased]

### Changed
 * Глобальный рефакторинг и структурирование кода.

	* Класс шаблона теперь ответчает за отображение хлебных крошек, meta и навгации
	* Класс `Admin` стал более системным и центральным. В него вынесены регистрируемые сервис провайдеры и алиасы
	  сервис контейнеров.
	  https://github.com/LaravelRUS/SleepingOwlAdmin/commit/43e24a7b43d0429283024e9b18c3c3dbb5207b65
	  
	  Алиасы для сервис контейнеров
	  ```php
	  [
		  'sleeping_owl' => ['SleepingOwl\Admin\Admin', 'SleepingOwl\Admin\Contracts\AdminInterface'],
		  'sleeping_owl.template' => ['SleepingOwl\Admin\Contracts\Template\TemplateInterface'],
		  'sleeping_owl.breadcrumbs' => ['SleepingOwl\Admin\Contracts\Template\Breadcrumbs'],
		  'sleeping_owl.widgets' => ['SleepingOwl\Admin\Contracts\Widgets\WidgetsRegistryInterface', 'SleepingOwl\Admin\Widgets\WidgetsRegistry'],
		  'sleeping_owl.message' => ['SleepingOwl\Admin\Widgets\Messages\MessageStack'],
		  'sleeping_owl.navigation' => ['SleepingOwl\Admin\Navigation', 'SleepingOwl\Admin\Contracts\Navigation\NavigationInterface'],
		  'sleeping_owl.wysiwyg' => ['SleepingOwl\Admin\Wysiwyg\Manager', 'SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygMangerInterface'],
		  'sleeping_owl.meta' => ['assets.meta', 'SleepingOwl\Admin\Contracts\Template\MetaInterface', 'SleepingOwl\Admin\Templates\Meta'],
	  ]
	  ```
	
 * Структурирование интерфейсов.
 
	```bash
	SleepingOwl\Admin\Contracts\ColumnInterface -> SleepingOwl\Admin\Contracts\Display\ColumnInterface`
	SleepingOwl\Admin\Contracts\DisplayInterface -> SleepingOwl\Admin\Contracts\Display\DisplayInterface
	SleepingOwl\Admin\Contracts\ActionInterface -> SleepingOwl\Admin\Contracts\Display\Extension\ActionInterface
	SleepingOwl\Admin\Contracts\ColumnFilterInterface -> SleepingOwl\Admin\Contracts\Display\Extension\ColumnFilterInterface
	SleepingOwl\Admin\Contracts\FilterInterface -> SleepingOwl\Admin\Contracts\Display\Extension\FilterInterface
	SleepingOwl\Admin\Contracts\NamedColumnInterface -> SleepingOwl\Admin\Contracts\Display\NamedColumnInterface
	SleepingOwl\Admin\Contracts\FormButtonsInterface -> SleepingOwl\Admin\Contracts\Form\FormButtonsInterface
	SleepingOwl\Admin\Contracts\FormElementInterface -> SleepingOwl\Admin\Contracts\Form\FormElementInterface
	SleepingOwl\Admin\Contracts\FormInterface -> SleepingOwl\Admin\Contracts\Form\FormInterface
	 ```
	 
 * Переделана инициализация хлебных крошек
	Для лучшей совместимости было принято решение об отказе от сервис провайдера `DaveJamesMiller\Breadcrumbs\ServiceProvider`, т.к.
	при испльзовании этого сервис провайдера была проблема с использованием пакета в своем приложении.
	Для использования пакета в своем приложении вы должны подключать самостоятельно сервис провайдер `DaveJamesMiller\Breadcrumbs\ServiceProvider`
	и регистрировать при необходимости фасад.
	
 * Вынос логики роутов отдельных компонентов из анонимных функций в контроллеры для возможности кеширования роутов.	 
 * Phpunit version `~4.1 -> ~5.0`


### Added

 * Collection `SleepingOwl\Admin\Form\FormElementsCollection`
 * Collection `SleepingOwl\Admin\Display\DisplayTabsCollection`
 * Collection `SleepingOwl\Admin\Display\ExtensionCollection`
 * Interface `SleepingOwl\Admin\Contracts\WithModel`
 * Admin Element Factories

	```php
	// Display Column Filters
	'sleeping_owl.column_filter' => SleepingOwl\Admin\Contracts\Display\DisplayColumnFilterFactoryInterface::class;
	
	// Displays
	'sleeping_owl.display' => SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface::class;
	
	// Display Columns
	'sleeping_owl.table.column' => SleepingOwl\Admin\Contracts\Display\DisplayColumnFactoryInterface::class;
	
	// Display ColumnEditables
	'sleeping_owl.table.column.editable' => SleepingOwl\Admin\Contracts\Display\DisplayColumnEditableFactoryInterface::class;
	
	// Display Filters
	'sleeping_owl.display.filter' => SleepingOwl\Admin\Contracts\Display\DisplayFilterFactoryInterface::class;
	
	// Forms
	'sleeping_owl.form' => SleepingOwl\Admin\Contracts\Form\FormFactoryInterface::class;

	// Form Elements
	'sleeping_owl.form.element' => SleepingOwl\Admin\Contracts\Form\FormElementFactoryInterface::class;
	```
	

### Issues

 * #377
 * #339
 * #405
 * #410
 * #368
 * #218
 * #404
 * #399
 * #418
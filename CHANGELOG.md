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
 
 
## 4.74.30

- fixed problem with using Display columns in form
- fixed #255
- fixed #269 
- added laravel 5.3 pagination support
- issue #272 
- fixed problem with custom validation messages
- pull request #287
- pull request #289
- pull request #291
- pull request #292
- pull request #294
- pull request #296 
- fixed #301
- pull request #304 
- pull request #312
- pull request #316
- added form element `number` - [Docs](http://sleepingowladmin.ru/docs/form-element#number)
- refactored display control buttons  - [Docs](http://sleepingowladmin.ru/docs/columns#control)
- pull request #337  - [Docs](http://sleepingowladmin.ru/docs/form-element#dependentselect)
- refactored Display column ordering
  
  ``` php
  AdminColumn::custom(function($model) 
         return $model->first_name.' '.$model->last_name;
  })->setOrderable(function($query, $direction) {
      $query->orderBy('last_name', $direction);
  })
  
  // Или просто передать ключ поля
  ->setOrderable('last_name')
  
  // Или с помощью класса реализующего интерфейс SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface
  ->setOrderable(new CustomOrderByClause())
  ```
- issue #347
- optimized and updated npm packages
- fixed display column filters
- pull request #352 
- pull request #355
- pull request #364
- issue #369
- issue #370 
- issue #371
- fixed problem with form element helpText
- refactored navigation badges - [Docs](http://sleepingowladmin.ru/docs/menu_configuration#page-badge)

Также обновлена документация на русском языке. http://sleepingowladmin.ru/docs


## 4.60.13

- fixed problem with reordering tree list
- fixed problem with using Display columns in form
- fixed problem with ordering datatable by date field
- fixed bug with using several wysiwyg filelds
- fixed problem with ModelConfiguration events `updating` and `creating`. Added new event `saving`
- fixed multiselect template
- fixed problem with display placable extensions
- added additional parameters to DisplayTab constructor
- fixed problem with console command `route:list` #263
- fix #243
- fix #248
- pull request #246
- pull request #251 

**After update:**
`php artisan vendor:publish --tag=assets --force`


## 4.60.0

- use webpack for javascript building
- use vuejs
- Fixed datatables range search
- Refactoring form elements - `image`, `images` and `file`. Use vuejs to render fields data
- Replaced flowjs with dropbox
- Replaced bootbox with sweetalets
- Added confirm dialog for tree control
- Wysiwyg Editor config array replaced to `Config\Repository`
- Added javascript modules system
- issue #237

**After update:**
`php artisan vendor:publish --tag=assets --force`


## 4.55.51

- fix #207 
- pull request #208
- pull request #210
- pull request #211
- fix #212
- pull request #215
- pull request #216
- pull request #224
- pull request #230
- pull request #231
- new element `AdminForm::elements`
- Improvements of form image, images and file elements .

You can use validators for files

``` php
AdminFormElement::image(...)->maxSize('2028') // kilobytes
AdminFormElement::image(...)->minSize('1024') // kilobytes
AdminFormElement::image(...)->addValidationRule('mimes:....') // 
AdminFormElement::image(...)->addValidationRule('dimensions:min_width=100,min_height=200') // https://laravel.com/docs/5.2/validation#rule-dimensions
// etc
```
- Add new console command `sleepingowl:section:provider`
- Update Ukraine language
- Fix problem with searching page by id


## 4.52.36

- Form panel refactoring
  https://github.com/LaravelRUS/SleepingOwlAdmin-docs/blob/master/form.md#panel
- #188
- #196 
- #198
- #201 
- #202
- #203 
- Extend `SleepingOwl\Admin\Display\Column\Link` class from `SleepingOwl\Admin\Display\Column\Url` class. Add Link attributes to url class
- Add new interface Placable for display extensions with custom placement https://github.com/LaravelRUS/SleepingOwlAdmin-docs/blob/master/displays.md#Расширение-таблиц
- Add ordering for display extensions
- Fix html for `tabbed` form
- Added tabs support in forms https://github.com/LaravelRUS/SleepingOwlAdmin-docs/blob/master/form.md#Табы
- Make tree reorder route customizable


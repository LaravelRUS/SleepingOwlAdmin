<p align="center"><h2>[Unreleased] (Only in <code class=" language-php">development</code> branch)</h2></p>

* [Add] Добавлена возможность передавать $payload в методы секции fireCreate() и fire Edit(), по аналогии с fireDisplay(). Это позволяет передавать дополнительные параметры в секцию для указанных методов.

* [Add] Добавлен новый тип столбца `AdminColumn::boolean('active', 'Published'),` (алиас `text`) который просто рисует галочку при `true` и минус при `false`. C равнением по центру.
  Замена коду:
  ```
  //было
  AdminColumn::custom('Published', function ($instance) {
    return $instance->active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-minus"></i>';})
    ->setHtmlAttribute('class', 'text-center'),

  //станет
  AdminColumn::boolean('active', 'Published'),
  ```

 * [Feature] Добавлен ENV-редактор
 
    Для тех кто уже с нами:

     ```php
     //  sleeping_owl.php

     /*
      |--------------------------------------------------------------------------
      | Middleware to use in admin routes
      |--------------------------------------------------------------------------
      | Url for env editor
      |
      */
      'env_editor_url' => 'env/editor',

      /*
       *
       *
       */
      'env_editor_excluded_keys' => [
          'APP_KEY', 'DB_*'
      ],


      'env_editor_middlewares' => [],

      'env_editor_policy' => Policy::class,

      'show_editor' => false,
    ```


 * [Feature] Subdomain routes for admin
             Вы должны добавить в sleeping_owl.php ключ 'domain' => 'admin.example.com' где example.com и будет ваш домен.
 * [Feature] Добавлено поведение для коламнов `text`, `link` и `relatedLink`. Может быть пропущен.
    Добавлен третий параметр, для сноски под текстом / ссылкой `AdminColumn::text('name', 'Name', 'user.created_at')` или `AdminColumn::link('name', 'Name', 'user.created_at')`
    ЗЫ: упрощайте свои кастомы

 * [Bug-Fix] Исправлено поведение `AdminFormElement::checkbox(...)->setReadonly(true)`

### 4.99.99
 * [Feature] Появился setUsage у селекто-подобных элементов (dev-mode) - не известно какие проблемы это повлечет за собой - однако несколько уже решаются.
 * [Feature] Добавлены плагины image2, youtube, uploadimage - в CKEditor. Параметры uploadUrl и filebrowserUploadUrl
             Как и раньше отвечали за линк сохранения изображений - если этих параметров нет изображения будут сохраняться
             в дефолтную папку указанную в imagesUploadDirectory
 * [Feature] Добавлена кнопка отмены фильтров на таблице
 * [Feature] Добавлен новый элемент AdminColumnEditable::select() - он подобен элементу AdminFormElement::select и имеет схожие методы задания списка.
 * [Feature] Теперь в админке есть менеджер BreadCrumbs
    * Вы можете добавлять breadcrumbs прямо из секции (initialize, onDisplay, onEdit )
    * Вы можете указывать родительские breadcrumbs
    * Вы можете указывать breadcrumbs c ссылкой и без ссылки
    ```php
    $this->addBreadCrumb([
        "id" => "App\Model\Forms\Form"
        "title" => "All Form Items"
        "url" => "https://demo.sleepingowladmin.ru/admin/forms"
        "parent" => "forms-examples"
    ])
    ```
    or
    ```php
    $this->addBreadCrumb([
        "id" => "some_name"
        "title" => "All Form Items"
        "url" => "https://demo.sleepingowladmin.ru/admin/forms"
        "parent" => "App\Model\Forms\Form"
    ])
    ```
    or
    ```php
    $this->addBreadCrumb([
        "id" => "some_end_name"
        "title" => "All Form Items"
        "url" => "https://demo.sleepingowladmin.ru/admin/forms"
        "parent" => "some_name"
    ])
    ```
 * [Bug-Fix] Пофикшено поведение breadcrumbs - теперь добавляет промежуточные
 * [Feature] Добавлен метод к selectajax и multiselectajax `setSearch` - он позволяет задать поле поиска.
             Пофикшено поведение этих элементов после сохранения в связи с последними обновлениями select и multiselect
 * [Feature] Пофикшено поведение ide-helper generator - после его выполнения нужно запускать команду php artisan sleepingowl:ide:generate
 * [Feature] Изменились селекты. Теперь по умолчанию стоит [vue-multiselect](http://monterail.github.io/vue-multiselect)
             Очень не завидую тем у кого появлялись кастомные темплейты на элементы AdminFormElement::select и AdminFormElement::multiselect
             их придется слегка подпилить.
             Оставляйте фидбеки.
 * [Feature] Появилась возможность редактировать JSON поля. Установка атрибутов идет в AtributeName через `field->key`
 * [Feature] Появилась пара новых эвентов
     * datatables::actions::submitting - эвент до действия после согласия SweetAlert в масс экшнс
     * datatables::actions::submitted  - эвент после действия после согласия SweetAlert масс экшнс
     * datatables::actions::cancel - эвент отказа окна SweetAlert во время масс экшнс

 * [Feature] Появилась пара новых эвентов
    * datatables::confirm::init - эвент при котором вы можете получить данные настроек SweetAlert и импровизировать как угодно
    * datatables::confirm::submitting - эвент до действия после согласия SweetAlert
    * datatables::confirm::submitted  - эвент после действия после согласия SweetAlert (обычно это отправка формы редирект или что то в этом роде
    * datatables::confirm::cancel - эвент отказа окна SweetAlert

    На них на всех можно подписаться как описано в документации - это открывает некоторые возможности заполнения форм.
    Сами скажете как это можно использовать или усовершенствовать.
 * [Feature] Появилась возможность создавать свои компоненты vue и крепить их к кастомным темплейтам. Подключать файлы можно обычным способом - зависимость admin-default. Структура компонента обычная.

   ```javascript
   Vue.component('element-image-example', Vue.extend({
       props: {
           //....
       },
       data () {
           return {
               //....
           }
       },
       mounted () {
           //....
       },
       methods: {
           //....
       },
       computed: {
           //....
       }
       //....
   }));
   ```

   В шаблон блейд такое + props если есть.
   ```html
    <element-image-sample></element-image-sample>
   ```
 * [Feature] Обновление vue -> vue2 | vue-resource -> vue-resource2
 * [Bug-Fix] Ошибка при получении данных для `AdminFormElement::images` из модели (`storeAsComaSeparatedValue()`) или если возникла ошибка сохранения формы.
 * [Bug-fix] Не выводились метки для редактируемых колонок. Теперь можно делать так: `AdminColumnEditable::text('fieldName', 'ColumnLabel')` и `AdminColumnEditable::checkbox('fieldName', 'CheckedLabel', 'UncheckedLabel', 'ColumnLabel')`, или по-старинке `->setLabel('ColumnLabel')`
 * [Bug-Fix] Теперь afterSave у MultiSelect учитывает ValueSkipped у элемента формы
 * [Feature] Добавлены SweetAlert2 к массовым действиям - контроллер который отвечает за получение и обработку ID должен возвращать json-data
   {text: "Текст заголовка", message: "Полный текст сообщения", type: "error|success"}
 * [Bug-fix] Исправлена работа `AdminFormElement::images('name', 'label')->storeAsJson()`.
 * [Bug-Fix] Исправлено поведение кнопки на AdminFormElement::images() - кнопка удаления реагировала на Enter
 * [Bug-Fix] Исправлено поведение AdminFormElement::images() с дублями
 * [Feature] Добавлен новый элемент AdminColumnEditable::text() - читаем в документации
 * [Feature] Добавлен метод setAfterSaveCallback() в Images - полезен когда нужно сколлектировать логику сохранения изображений и привязываний их в модель
   Пример:
   ```php
   ->setAfterSaveCallback(function ($value, $model) {
       if ($value) {
           //... сюда приходит value с поля и модель после сохранения
           //... Имейте ввиду что этот колбек вызовется только после всех валидаций и сохранения модели
       }
   })
   ```
 * [Feature] Добавлен метод для DataTablesAsync setDisplayLength что бы отключать селект выбора количества записей на страницу
 * [Bug-fix] Повикшено поведение setDisplaySearch для Async Tables теперь можно отключить поле поиска без выключения общего поиска.
 * [Bug-fix] Пофикшено поведение селект-фильтра - теперь отправляет не текст - а ключ значения.
 * [Feature] ColumnEditable::checkbox обзавелся методом setUrl - теперь вы можете установить свой url для отправки
    данных и принятия их допустим в Кастом контроллере
 * [Bug-fix] Пофишкено поведение column editable
 * [Bug-fix] Пофикшено поведение Scopes с нашими `SimpleTreeType`, `OrderTreeType` и скоупы не срабатывали ни в табе
    ни до таба, ни в основном окне, ни через payload в fireDisplay.
    Наслаждайтесь.
 * [Refactor] `setPivotCallback` -> `setSyncCallback` - теперь он отвечает не за формирование массива для sync,
   а полностью за функцию приаттачивания или синка после сохранения модели. Иногда требуется дополнительная логика
   приаттачивания записей к модели. (Работает пока что только для `belongsToMany`)
 * [Bug-fix] Пофикшено поведение элемента lists и сопутствующих работающих с belongs to many, has many и тд
   теперь в lists могут отображаться hasMany.(hasMany|BelongsToMany|hasManyThrough).(attribute)
   поидее могут работать несколько уровней вложенности, но это поведение не тестировалось
   пример:
   ```php
   AdminColumn::lists('subscriptions.nhs.name')
                ->setLabel("some label"),
   ```
   `ModelOfSection.php`
   ```php
   public function subscriptions()
   {
       return $this->hasMany(
           AnotherModel::class,
           'some_id',
           'id'
       )->where('terminate_at', '>', Carbon::now());
   }
   ```

   `AnotherModel.php`
   ```php
        public function nhs()
        {
            return $this->belongsToMany(
                BelongsToManyModel::class,
                'someTable',
                'modelofsection_another_id',
                'nh_id'
            );
        }
   ```
   ну и понятно атрибут в модели BelongsToManyModel например `name`
 * [Bug-fix] Пофикшено поведение $query->count() - Включался order для Async

### 4.95.29
 * Добавлены колбеки на поля. Теперь каждому полю доступен ряд колбеков и ряд логики с операциями Order,
   Search(основной на Async) и FilterSearch (отдельный фильтр на колонке переопределение его логики)
   Если у вас есть кастомная логика на Order или Search или FilterSearch вы можете вызвать на коламне:
    ```php
    setSearchCallback(function($column, $query, $search){
      //Тут ваша логика
      //например $query->where($column->getName(), 'like', "%$search%");
    })
    ```
    ```php
      setOrderCallback(function($column, $query, $search){
         //Тут ваша логика
         //например $query->orderBy($column->getName(), 'asc');
      })
    ```
    ```php
     setFilterCallback(function($column, $query, $search){
        //Тут ваша логика
     })
     ```

     Если у вас много однотипной логики, которую вы не хотите прописывать в каждом коламне
     вы можете вызвать:
     ```php
       ->setMetaData(SomeColumnMetaData::class)
     ```
     `SomeColumnMetaData.php`
     ```php

     namespace App\Modules\Nhs\Admin\ColumnsMeta;


     use Illuminate\Database\Eloquent\Builder;
     use SleepingOwl\Admin\Contracts\Display\ColumnMetaInterface;
     use SleepingOwl\Admin\Contracts\Display\NamedColumnInterface;

     class SomeColumnMetaData implements ColumnMetaInterface
     {
         public function onFilterSearch(NamedColumnInterface $column, Builder $query, $queryString, $queryParams)
         {
             // Implement onFilterSearch() method.
         }

         public function onOrderBy(NamedColumnInterface $column, Builder $query, $direction)
         {
             // Implement onOrderBy() method.
         }

         public function onSearch(NamedColumnInterface $column, Builder $query, $queryString)
         {
             // Implement onSearch() method.
         }

     }
     ```
     Вы можете создать любой из этих методов - и все они будут работать.
     Так же на каждом фильтре есть свой колбек (если честно надобность его я не особо понимаю однако оставил ввиду обратной совестимости)
     Вызвать его можно на фильтре setCallback()

     Помните про приоритет прерывания (расположены по старшинству):

     - Если у вас есть ColumnMeta::class - сработает только тот метод который будет в нем (onSearch onFilterSearch onOrderBy)
     дальнейшую логику он прервет
     - Если у вас setSearchCallback - сработает он и дальнейшая логика будет прервана
     - Если у вас есть setCallback - непосредственно на фильтре - в операции Filter он сработает если не будет ни колбека на коламне - ни колбека в ColumnMeta::class
     - Если у вас нету ничего из вышеперечисленного - сработает дефолтная логика всех 3 операций

     **Всем добра**

 * Исправлена дефолтная логика сортировки для столбцов с отношениями. Теперь в секции Users поле post.name
   поле будет сортироваться без ошибок. Однако эта сортировка не будет работать с EagerLoad, то есть она не будет сортировать поле
   в секции `Posts` - `category.user.name`
 * Добавлен тип `OrderTreeType::class` который ограничивает дерево только на первый уровень
 (работает без parent_id) и позволяет сортировать элементы
    Пример можно увидеть по [ссылке в демо](https://demo.sleepingowl.ru/admin/page_orders)
    Пример кода можно увидеть в секции [PageOrders.php](https://github.com/SleepingOwlAdmin/demo/blob/master/admin/Http/Sections/PageOrders.php#L56)
 * Добавлена возможность указывать деревьям максимальный уровень вложенности `setMaxDepth(10)`
 * Добавлен метод setDisplaySearch(true|false) для установки параметра отображения общего поля поиска для DataTablesAsync
 * Добавлен коллбек на мультиселект и ajax-мультиселект который контролирует pivot-data
   ```php
    AdminFormElement::multiselectajax('someBelongToManyRelation', "SomeLabel")
        ->setModelForOptions(SomeModelWithBelongsToRelation::class)
        ->setDisplay('some_display_field')

        ->setPivotCallback(function($values){
           //$values - массив данных что будет передаваться в sync
           //Обычно это массив id [1, 2, 3];
           //Что бы sync сьел данные с pivot нужно сделать так
           //[1 => ['order' => 9], 2 => ['order' => 6], 3 => ['order' => 7] ]
           //И после вернуть значение $values

           return $values;
        }),

        ->required()
   ```
 * Теперь после обработки формы если у вас на форме есть таб и если даже этот таб внутри таба
   родительский определится и будет активным. Больше не нужно переключаться все время с первого на нужный
   Протестировать можно [тут](https://demo.sleepingowl.ru/admin/contact5s)
 * Теперь политики поддерживают Light-DDD структуру
    AdminSectionServiceProvider теперь имеется $policies  (property)не путать с методом.
    это ассоциативный массив Section::class => Policy::class. Если для секции правило в этом массиве не определено,
    то Gate будет запрашивать неймспейс политик указанный в sleeping_owl.php + имя секции + SectionModelPolicy
    т.е. Если секция называется Users то политика будет к примеру App\Policy\UsersSectionModelPolicy.php - это не всегда удобно.
    Теперь с помощью $policies можно хранить политики где угодно.

 * Поправлено поведение payload реализованном в этом #432 issue ( не работал с async )

    ```php
    if(!is_null($id))
    {
         $contacts = AdminSection::getModel(Contact::class)->fireDisplay(['scopes' => ['withBusiness', $id]]);

         $tabs[] = AdminDisplay::tab($contacts)
             ->setLabel("Contacts")
             ->setIcon('<i class="fa fa-credit-card"></i>');
    }
    ```

    В секции должно быть что то типо
    ```php
    public function onDisplay($scopes = [])
    {

            $display = AdminDisplay::datatablesAsync()->paginate(10);
            if($scopes){
                  $display->getScopes()->push($scopes);
            }
    }

    ```
 * Пофикшено поведение AdminColumnEditable, в нашем случае checkbox в табах и коламнах
 * Добавлен метод getCancelUrl для установки Url кнопки Отмены
 * Переработан механизм кнопок формы
    * Теперь кнопки формы можно засунуть под либо над любым полем в форме (помимо стандартного их места нахождения)
    * Кнопки теперь отдельные объекты с возможностью указать свои аттрибуты.
    * Кнопки теперь можно менять местами и заменять в стандартном наборе
    * Каждая кнопка имеет набор групповых параметров groupElements которые являеются элементами ( выводятся в дропдауне )
    * Можно добавлять в набор свои кнопки используя класс FormButton
    * Ищите примеры в [демо-репозитори](https://github.com/SleepingOwlAdmin/demo)  - документацию в ближайшее время подотовит @lunatig
 * Исправлены поведения фильтров ( пофикшена работа с BigData - добавлены эвенты обработки на Enter и Доп. Кнопка
  в ControlColumn, которую кстати можно задавать самостоятельно)
 * Исправлена работа dataTablesAsync в AdminDisplayTabbed
 * Пофикшены проблемы, идентифицированы новые ( скорее всего добавлены новые )
 * Пофикшены issue #467 и #504
 * Фильтры переработаны с эвентов keyup и change на эвенты keyup (keyCode=ENTER) и общую кнопку
 * Добавлены баджи к tab (имеется проблема с css, но не у всех) читать в документации
 * Добавлена поддержка HtmlAttributes для всех AdminFormElement кроме File,Upload,Image,Images
    Теперь AdminFormElement поддерживает методы setHtmlAttributes, setHtmlAttribute и прочие.
 * Рефакторинг JS кода (http://sleepingowladmin.ru/docs/javascript)

    Отказ от хранения настроек по url `admin/scripts`, теперь глобальный конфиг хранится в body шаблона.
    Перенос `app.js` в футер

### 4.82.20
 * Добавлен колбек на сохранение файлов (читать в документации)
     ```php
       AdminFormElement::images('some_images', "Some Label")
               ...
           ->setSaveCallback(function ($file, $path, $filename, $settings) use ($id) {
               $result = $youimage;

               return ['path' => $result['url'], 'value' => $result['path|url']];
           }),
     ```
 * Исправлена проблема с заменой контроллера для раздела для Laravel версии > 5.2

 * Перенос интерфейсов `SleepingOwl\Admin\Contracts\RepositoryInterface` и `SleepingOwl\Admin\Contracts\TreeRepositoryInterface` в директорию `SleepingOwl\Admin\Contracts\Repositories`
 * Замена название директории `src\Repository` в `src\Repositories`
 * Добавлена поддержка Laravel 5.4
 * В конструктор класса раздела добавлен еще один обязательный параметр `Application $app`

    ```php
    public function __construct(\Illuminate\Contracts\Foundation\Application $app, $class)
    {
        ...
    }
    ```

 * Исправлена проблема с использованием Policy в классах разделов.

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
 * Полностью переработал принцип работы с различными типами репозиториев, которые используются для построения дерева.

   Теперь за каждый тип дерева отвечает отдельный класс, https://github.com/LaravelRUS/SleepingOwlAdmin/tree/development/src/Display/Tree Это позволяет нам полностью отвязать `TreeRepository` от конкретного пакета построения дерева и использовать свои реализации.

   Для поддержки своего типа дерева необходимо добавить свой класс, для удобства его можно наследовать от `SleepingOwl\Admin\Display\Tree\NestedsetType` и реализовать те методы, которые он попросит. В случае @lunatig будет выглядеть как-то так:

   ```php
   <?php

   namespace Admin\Tree;

   use Illuminate\Database\Eloquent\Model;
   use SleepingOwl\Admin\Display\Tree\BaumNodeType;

   /**
    * @see https://github.com/etrepat/baum
    */
   class CustomBaumNodeType extends BaumNodeType
   {
       /**
        * Get tree structure.
        *
        * @param \Illuminate\Database\Eloquent\Collection $collection
        *
        * @return mixed
        */
       public function getTree(\Illuminate\Database\Eloquent\Collection $collection)
       {
           return $collection->toSortedHierarchy();
       }
   }
   ```

   А дальше при инициализации `DisplayTree` мы указываем этот класс

   ```php
   AdminDisplay::tree(\Admin\Tree\CustomBaumNodeType::class)->...
   ```


### Added

 * Collection `SleepingOwl\Admin\Form\FormElementsCollection`
 * Collection `SleepingOwl\Admin\Display\DisplayTabsCollection`
 * Collection `SleepingOwl\Admin\Display\ExtensionCollection`
 * Interface `SleepingOwl\Admin\Contracts\WithModelInterface`
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
 * #438
 * #461
 * #463
 * #473


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

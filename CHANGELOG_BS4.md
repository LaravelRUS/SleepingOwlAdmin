# Новый LTE с Bootstrap 4


## Changelog
Обновлены npm пакеты
- Sweetalert2 8.14.0
- Fontawesome 5.9.0
- Admin-lte v3.0.0-beta.1
- Bootstrap 4.3.1
- Noty 3.2.0-beta
- добавлен редактор Summernote
- добавлен ckeditor5, (4.7 оставлен как локальный)
- Добавлен плагин js-cookie


## Переход
* Взять ветку с новым дизайном `"laravelrus/sleepingowl": "dev-bs4"`
* Нужно обновить ассеты `php artisan sleepingowl:update`
* Проверить конфиг `App\config\sleeping_owl.php` и добавить новые пункты из `https://github.com/LaravelRUS/SleepingOwlAdmin/blob/bs4/config/sleeping_owl.php`
* Чтоб меню постоянно не разворачивалось нужно добавить исключение куки `'menu-state'` в файл `app\Http\Middleware\EncryptCookies.php` вашего проекта


### Обновление конфига
- `logo` - только картинка (символ) как для мини-лого
- `minilogo` - уже не используется (вместо полного названия используется `title`)


### Что пока не поддерживается
- Классы для табов (ф-ционал нуждается в исправлении)
- Элемент формы timestamp (не работают скрипты)


### Что поправлено
* Собраны старые и новые стили (SCSS), перерабатываются
* Собраны старые и новые скрипты, перерабатываются
* Стили пагинации
* Часть контрольных кнопок
* Навигация активные списки и раскрываются
* Дропдаун кнопок починить
* Табы работают нормально
* Пофиксил Badge's
* Tooltips загружаются автоматически
* Order отображается по центру
* Теперь нет смещения от звездочки в формах, если поля обязательные
* Select2 (scss + JS)
* Vue-Multiselect (scss + js)
* Sweetalert2 (scss + all js)
* Noty (по умолчанию тема metroui, но стили подключены все)
* Datepicker на Bootstrap4 (заменен на Datetimepicker для BS4)
* hover для таблиц
* Респонсивность table
* Display-action стили в шапке dataTables
* Запомнить раскрыт ли сайдбар (localstorage или кука)
* Добавлен summernote редактор
* стили datetime в фильтрах (проверить)
* Добавлены фонтавесомы 5 (4-я версия отключена)
* Editable поля (поправить стили select)
* добавлен метод `setDisplayed(bool|Closure $displayed): static`. Установка атрибута "отображать или нет". Используется для политик или для других нужд.
* Табы поломалось добавление классов (setHtmlAttribute) - поправлено
* `AdminColumnEditable` - навесить политики (`data-disabled='true'`)
* Проблемы с `AdminColumn::order()` поправлены
* Метод `onCollapse(bool)` для wysiwyg поля (свернуто)
* Прикручен автоапдейт дататейблса. В конфиге можно включить и выставить значение в минутах
* https://github.com/LaravelRUS/SleepingOwlAdmin/issues/983


### Респонсивность сделать
* data-таблицам (частично)
* Табам
* Формам


### Что сделать
* `AdminFormElement::daterange` поправить бэк (склеить 2 даты в кучу и починить атрибуты)
* Допилить `->setFormat()` на даты (не работает)
* Запомнить последний таб (localstorage или кука)
* Вынести стилей и скрипты для персборки ассетов (сделано SCSS)
* `AdminFormElement::file` проверить на ошибку в Vue
* Добавить методу Gravatar доп.поле для выбора аватарки кастомной
* Добавить метод для `lists` выбор цвета, иначе пусть под цвет таблицы
* Добавить метод для `url` выбор иконки
* Подгрузка дефаулт иконки, если соединения нет в гаватаре
* перепроверить цвет плейсхолдеров (сильно темные и похожи на валуе)


### Отменено
* В навигацию перенести заголовок (щас Main Menu)
* DependentSelect переделать бы с select2 на Vue-Multiselect

### Что изменено / планируется
* Обновить CKeditor
* `AdminColumnEditable::boolean` с обычным кликом, без попап
* https://github.com/LaravelRUS/SleepingOwlAdmin/issues/200 скрытие/отображение по кнопке
* https://github.com/LaravelRUS/SleepingOwlAdmin/issues/703 добавление динамических полей
* https://github.com/LaravelRUS/SleepingOwlAdmin/issues/895 ошибка в табах
* https://github.com/LaravelRUS/SleepingOwlAdmin/issues/993 (проверить)
* https://github.com/LaravelRUS/SleepingOwlAdmin/issues/900


### В доку дописать
* `AdminColumnEditable::textarea`
* `AdminColumn::boolean`
* `AdminColumn::gravatar('email', 'Ava')` Граватарки
* `setCollapsed(bool|Closure $collapses): static` для wysiwyg поля
* `setDisplayed(bool|Closure $displayed): static` для всех полей
* Автоапдейт для дататейблов как вкл/выкл
* Остальные поля, которых нет и их методы
* Третий параметр в обычных коламнах `AdminColumn::link('title', 'Title', 'created_at')`
* Для табов появился класс `.last`. Добавление таба в конец списка и к правой стороне


### Баги
- В экшены не вставляются нормально иконки. В `option` не рендерятся.
- Не работает `Refresh DataTable` и `Stop Refresh Page` его api (с дев ветке тоже не хочет)

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


### Респонсивность сделать
* data-таблицам (частично)
* Табам
* Формам


### Что сделать
* `AdminFormElement::daterange` поправить бэк (склеить 2 даты в кучу и починить атрибуты)
* Допилить `->setFormat()` на даты (не работает)
* В навигацию перенести заголовок (щас Main Menu)
* Запомнить последний таб (localstorage или кука)
* DependentSelect переделать бы с select2 на Vue-Multiselect
* Вынести стилей и скрипты для персборки ассетов (сделано SCSS)
* Табы поламалось добавление классов (setHtmlAttribute)
* `AdminColumnEditable` - навесить политики (`data-disabled='true'`)
* `AdminFormElement::file` проверить на ошибку в Vue


### Что изменено / планируется
* Обновить CKeditor
* `AdminColumnEditable::boolean` с обычным кликом, без попап


### В доку дописать
* `AdminColumnEditable::textarea`
* `AdminColumn::boolean`
* Третий параметр в обычных коламнах `AdminColumn::link('title', 'Title', 'created_at')`


### Поиск багов
К известным багам добавил коммент `##fix##` - можно искать по файлам и поправлять, кто желает


### Баги
- Табы и лейбл + поиск кириллицей в datatables (перепроверить)
- Какие-то жесткие проблемы с `AdminColumn::order()` (перепроверить)
- Не работает `Refresh DataTable` и `Stop Refresh Page` его api (с дев ветке тоже не хочет)

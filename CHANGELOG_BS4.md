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


### Респонсивность сделать
* data-таблицам (частично)
* Табам
* Формам


### Что сделать
* стили datetime в фильтрах
* `AdminFormElement::daterange` поправить бэк (склеить 2 даты в кучу и починить атрибуты)
* Допилить `->setFormat()` на даты (не работает)
* Display-action стили в шапке dataTables
* В навигацию перенести заголовок (щас Examples)
* Запомнить раскрыт ли сайдбар (localstorage или кука)
* Запомнить последний таб (localstorage или кука)
* DependentSelect переделать бы с select2 на Vue-Multiselect
* Вынести стилей и скрипты для персборки ассетов (сделано SCSS)
* Табы поламалось добавление классов (setHtmlAttribute)
* Editable поля (поправить стили select)
* `AdminColumnEditable` - навесить политики (`data-disabled='true'`)
* `AdminFormElement::checkbox` локализация чекнутого бокса


### Что изменено / планируется
* Обновить CKeditor
* Добавить summernote
* Добавлены фонтавесомы 4 и 5 (может отключить старые?)
* `AdminColumnEditable::boolean` с обычным кликом, без попап


### В доку дописать
* `AdminColumnEditable::textarea`
* `AdminColumn::boolean`


### Поиск багов
К известным багам добавил коммент `##fix##` - можно искать по файлам и поправлять, кто желает


### Баги
- Табы и лейбл + поиск кириллицей в datatables (перепроверить)
- Какие-то жесткие проблемы с `AdminColumn::order()` (перепроверить)
- Не работает `Refresh DataTable` и `Stop Refresh Page` его api (с дев ветке тоже не хочет)

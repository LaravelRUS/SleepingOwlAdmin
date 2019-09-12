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
- Элемент формы timestamp (не работают скрипты) (deprecated либо алиас от datetime)


### Что поправлено
* [x] Классы для табов (ф-ционал нуждается в исправлении)
* [x] Собраны старые и новые стили (SCSS), перерабатываются
* [x] Собраны старые и новые скрипты, перерабатываются
* [x] Стили пагинации
* [x] Часть контрольных кнопок
* [x] Навигация активные списки и раскрываются
* [x] Дропдаун кнопок починить
* [x] Табы работают нормально
* [x] Пофиксил Badge's
* [x] Tooltips загружаются автоматически
* [x] Order отображается по центру
* [x] Теперь нет смещения от звездочки в формах, если поля обязательные
* [x] Select2 (scss + JS)
* [x] Vue-Multiselect (scss + js)
* [x] Sweetalert2 (scss + all js)
* [x] Noty (по умолчанию тема metroui, но стили подключены все)
* [x] Datepicker на Bootstrap4 (заменен на Datetimepicker для BS4)
* [x] hover для таблиц
* [x] Респонсивность table
* [x] Display-action стили в шапке dataTables
* [x] Запомнить раскрыт ли сайдбар (localstorage или кука)
* [x] Добавлен summernote редактор
* [x] стили datetime в фильтрах (проверить)
* [x] Добавлены фонтавесомы 5 (4-я версия отключена)
* [x] Editable поля (поправить стили select)
* [x] добавлен метод `setDisplayed(bool|Closure $displayed): static`. Установка атрибута "отображать или нет". Используется для политик или для других нужд.
* [x] Табы поломалось добавление классов (setHtmlAttribute) - поправлено
* [x] `AdminColumnEditable` - навесить политики (`data-disabled='true'`)
* [x] Проблемы с `AdminColumn::order()` поправлены
* [x] Метод `onCollapse(bool)` для wysiwyg поля (свернуто)
* [x] Прикручен автоапдейт дататейблса. В конфиге можно включить и выставить значение в минутах
* [x] https://github.com/LaravelRUS/SleepingOwlAdmin/issues/983
* [x] `actions` уведомление при отсутствии выбора экшена или не отмеченных чекбоксов


### Респонсивность сделать
* [ ] data-таблицам (частично)
* [ ] Табам
* [ ] Формам


### Что сделать
* [ ] `AdminColumn::link` починить атрибуты
* [ ] `AdminFormElement::daterange` поправить бэк (склеить 2 даты в кучу и починить атрибуты)
* [ ] Допилить `->setFormat()` на даты (не работает)
* [ ] Запомнить последний таб (localstorage или кука)
* [ ] Вынести стилей и скрипты для персборки ассетов (сделано SCSS)
* [ ] `AdminFormElement::file` проверить на ошибку в Vue
* [ ] Добавить методу Gravatar доп.поле для выбора аватарки кастомной
* [ ] Добавить метод для `lists` выбор цвета, иначе пусть под цвет таблицы
* [ ] Добавить метод для `url` выбор иконки
* [ ] Подгрузка дефаулт иконки, если соединения нет в гаватаре
* [ ] перепроверить цвет плейсхолдеров (сильно темные и похожи на валуе)
* [ ] small для `relatedLink`
* [ ] бок с автоапдейтом (полностью спрятать кнопку закрыть)


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
* [ ] `AdminColumnEditable::textarea`
* [ ] `AdminColumn::boolean`
* [ ] `AdminColumn::textaddon` с методами
* [ ] `AdminColumn::gravatar('email', 'Ava')` Граватарки
* [ ] `setCollapsed(bool|Closure $collapses): static` для wysiwyg поля
* [ ] `setDisplayed(bool|Closure $displayed): static` для всех полей
* [ ] Автоапдейт для дататейблов как вкл/выкл
* [ ] Остальные поля, которых нет и их методы
* [ ] Третий параметр в обычных коламнах `AdminColumn::link('title', 'Title', 'created_at')`
* [ ] Для табов появился класс `.last`. Добавление таба в конец списка и к правой стороне
* [ ] Перепилить админку
* [ ] Дописать, что при использовании поиска в дататейблсах на связи обязательно нужно калбеки на ордерабле(если есть), иначе поиск будет с ошибкой


### Баги
- В экшены не вставляются нормально иконки. В `option` не рендерятся.

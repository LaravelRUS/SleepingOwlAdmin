# Сделано
* [x] Старые правки стерты
* [x] `->setSmall()` для чекбоксов и прочих от `TableColumn`



## Планируется
- [ ] Helper for image/images to h/w = 100% для image и images
- [ ] Локализовать `AdminFormElement::selectajax` (частично)
- [ ] посмотреть `setVisible`, к табам
- [ ] Вынести стилей и скрипты для персборки ассетов (сделано SCSS)
- [ ] Сохранить->сохранить/закрыть выкидывает в корень, `->getDisplayUrl()` (словить зависимость)
- [ ] Перепроверить stub
- [ ] DependentSelect переделать с select2 на Vue-Multiselect
- [ ] Обновить и пересобрать CKeditor 5
- [ ] Постепенно выпиливать jQ и готовится к BS5 и Laravel 8
- [ ] Вынести часовой пояс опять в app


### Не утверждено
- [ ] Добавить методу Gravatar доп.поле для выбора аватарки кастомной
- [ ] Добавить поле для работы с картами
- [ ] Подгрузка дефаулт иконки, если соединения нет в гаватаре
- `AdminColumnEditable::boolean` с обычным кликом, без попап
- https://github.com/LaravelRUS/SleepingOwlAdmin/issues/200 скрытие/отображение по кнопке


### В доку дописать
* [ ] `->setVisibled(true)` для display
* [ ] `->setVisible(true)` для форм
* [ ] `->setVisibilityCondition()` deprecated
* [ ] для респонсивности широких таблиц `->setHtmlAttribute('class', 'hidden-sm')` (не работает в дататейблсах)
* [ ] `AdminColumnEditable::textarea`
* [ ] `AdminColumnEditable::datetime`
* [ ] `AdminColumnEditable::date`
* [ ] `AdminColumn::boolean`
* [ ] `AdminColumn::timestamp`
* [ ] `AdminColumn::url` со всеми методами
* [ ] `AdminColumn::textaddon` с методами
* [ ] `AdminColumn::gravatar('email', 'Ava')` Граватарки
* [ ] `setCollapsed(bool)` для wysiwyg поля
* [ ] Автоапдейт для дататейблов как вкл/выкл
* [ ] Остальные поля, которых нет и их методы
* [ ] Третий параметр в обычных коламнах `AdminColumn::link('title', 'Title', 'created_at')` и во многих других полях или `->setSmall('Редактировать', true)` (или `->setSmall('created_at')`). Можно вернуть калбэк
* [ ] Для табов появился класс `.last`. Добавление таба в конец списка и к правой стороне
* [ ] Дописать, что при использовании поиска в дататейблсах на связи обязательно нужно калбеки на ордерабле(если есть), иначе поиск будет с ошибкой
* [ ] `lists` цвета от цвета таблицы, смена цвета через атрибуты `->setHtmlAttribute('class', 'badge-list-warning')`
* возвраты ошибок `error_message`, `success_message` и прочие
* `AdminColumnFilter` как передавать отображать и фильтровать
* `->setModifier` для поля text
* Классы хелперы для таблиц (`.th-center`, `.table-striped` и прочие)

<p align="center"><h2>[Unreleased] (Only in SleepingOwl <code class="language-php">7+</code> branch)</h2></p>

## 2020-05-31
* [Fix] Fix hasMany element error in output paths, output of fields: images, files, image, file

## 2020-05-24
* [Update] NPM packages:
  - admin-lte: 3.0.4 -> 3.0.5
  - bootstrap: 4.4.1 -> 4.5.0
  - jquery: 3.5.0 -> 3.5.1
  - datatables.net: 1.10.20 -> 1.10.21
  - datatables.net-bs4: 1.10.20 -> 1.10.21
  - datatables.net-responsive: 2.2.3 -> 2.2.5
  - fullcalendar: 3.10.0 -> 3.10.2
  - i18n: 0.9.0 -> 0.9.1
  - moment: 2.24.0 -> 2.26.0
  - node-sass: 4.14.0 -> 4.14.1
  - sweetalert2: 9.10.12 -> 9.13.1


## 2020-04-30
* [Update] NPM packages:
  - admin-lte: 3.0.2 -> 3.0.4
  - jquery: 3.1.1 -> 3.5.0
  - i18next: 19.3.3 -> 19.4.4
  - node-sass: 4.13.1 -> 4.14.0
  - sweetalert2: 9.10.6 -> 9.10.12
  - sass: 1.26.3 -> 1.26.5
  - i18n: 0.8.6 -> 0.9.0


## 2020-03-24
* [Update] NPM packages:
  - @fortawesome/fontawesome-free: 5.12.1 -> 5.13.0
  - cross-env: 7.0.0 -> 7.0.2
  - dropzone: 5.5.1 -> 5.7.0
  - i118n: 0.8.5 -> 0.8.6
  - i118next: 19.3.2 -> 19.3.3
  - laravel-mix: 5.0.1 -> 5.0.4
  - sass: 1.26.1 -> 1.26.3
  - sweetalert2: 9.7.2 -> 9.10.6


## 2020-03-18
* [add] Add ENV editor setting `env_keys_readonly`
* [add] Add ENV editor setting `env_can_delete`
* [add] Add ENV editor setting `env_can_add`


## 2020-03-11
* [Fix] Fix locale multiselect
* [Fix] Fix tooltip image and images and delete button text
* [Fix] Fix image/images icons width fix
* [Add] Add navigation title if len more then 15 char


## 2020-03-06
* [Fix] Fix sidebar ul->ul style
* [Fix] Fix work with custom element hasMany, ManyToMany, BelongTo
* [Revert] back class `.last` for tabs item


## 2020-03-01
* [Fix] Fix saving group elements, add generation index for new group


## 2020-02-27
* [Fix] Fix collapset sidebar style
* [Fix] Fix editable column width `50px -> 70px`
* [Fix] Changed default font size to 14px -> 16px
* [Fix] Fix style for Tabs
* [Add] Add `setReadonly(bool)` for editable fields


## 2020-02-26
* [Add] Add draggable(boolean) in `AdminFormElement::images`


## 2020-02-15
* [Update] NPM packages:
  - @fortawesome/fontawesome-free: 5.12.0 -> 5.12.1
  - sweetalert2: 9.7.0 -> 9.7.2


## 2020-01-28
* [Add] Updated datatebles reDraw after action
* [Fix] Fix Vue isolation in display lists and columns
* [Fix] Fix action selected error
* [Fix] Fix nestable button width
* [Update] NPM packages:
  - @flowjs/flow.js: 2.13.2 -> 2.14.0
  - axios: 0.19.1 -> 0.19.2
  - admin-lte: 3.0.1 -> 3.0.2
  - i18n: 0.8.4 -> 0.8.5
  - i18next: 19.0.3 -> 19.1.0
  - node-sass: 4.13.0 -> 4.13.1
  - sweetalert2: 9.5.4 -> 9.7.0
  - select2: 4.0.12 -> 4.0.13
  - sass: 1.24.3 -> 1.25.0
  - sass-loader: 8.0.0 -> 8.0.2
  - cross-env: 6.0.3 -> 7.0.0


## 2020-01-23
* [Fix] Fix `setReadonly` in `AdminFormElement::selectajax`


## 2020-01-20
* [Fix] Fix issue #900 isolated Vue `{{}}`


## 2020-01-09
* [Fix] Scroll to top animate
* [Update] NPM packages:
  - @fortawesome/fontawesome-free: 5.11.2 -> 5.12.0
  - axios: 0.19.0 -> 0.19.1
  - bootstrap: 4.3.1 -> 4.4.1
  - i18next: 19.0.1 -> 19.0.3
  - laravel-mix: 5.0.0 -> 5.0.1
  - sortablejs: 1.10.1 -> 1.10.2
  - sweetalert2: 9.3.16 -> 9.5.4
  - vue: 2.6.10 -> 2.6.11
  - sass: 1.23.7 -> 1.24.3
  - vue-template-compiler: 2.6.10 -> 2.6.11


## 2019-12-24
* [Add] Scroll to top buttom
* [Fix] Fix badge white-space to inherit
* [Fix] Fix scrollbar-size width from 0.5rem to 0.8rem
* [Fix] Add table filter TD position relative


## 2019-12-10
* [Fix] Fix multiselect required error message


## 2019-12-02
* [Delete] Delete `->setCollapsed( true/false )`, use `->setCollapsedLevel(0)`
* [Add] Add `->setCollapsedLevel(3)`


## 2019-11-21
* [Update] NPM packages:
  - admin-lte: v3.0.0-rc.1 -> 3.0.1 (! Released)
  - datatables.net: 1.10.19 -> 1.10.20
  - i18n: 0.8.3 -> 0.8.4
  - i18next: 17.0.6 -> 17.3.1 -> 19.0.1 (! Major)
  - node-sass: 4.12.0 -> 4.13.0
  - progressbar.js: 1.0.1 -> 1.1.0 (!)
  - select2: 4.0.8 -> 4.0.12
  - sweetalert2: 8.14.0 -> 8.19.0 -> 9.3.16 (! Major)
  - cross-env: 6.0.0 -> 6.0.3
  - resolve-url-loader: 3.1.0 -> 3.1.1
  - sass: 1.22.7 -> 1.23.7


## 2019-11-17
* [Change] Changed filter behavior when `->setOperator('in')` you can filter multiple values separated by commas. Example: `18,20` in filter field


## 2019-11-13
* [Change] Change breadcrumbs position on col-12 and top page
* [Fix] Fix badge bg-color
* [Add] Add class for DisplayTabbed `AdminDisplay::tabbed()->setHtmlAttribute('class', 'foo')`
* [Fix] Fix issue #1143


## 2019-11-12
* [Add] Add `->setSortable(true / false)` in `AdminColumn::lists(...)`


## 2019-11-08
* [Fix] Fix clear session in MessagesStack
* [Doc] Need add to doc `\MessagesStack::addError('text')`


## 2019-11-07
* [Fix] Fix `AdminColumnEditable` nullable value and localized empty data
* [Fix] Fix label in `AdminColumnEditable::checkbox`
* [Add] MaxFileSize in form element `image`, `images`, `file`
* [Fix] Fix image link style


## 2019-11-06
* [Fix] Fix `.row` width
* [Fix] Fix `.content.body` css display (fix h-scroll)
* [Add] Add `->setImage('/images/avatar.jpg')` in `ControlLink` and `ControlButton`
* [Add] Add class `.img-control` for image in control block (`->setHtmlAttribute('class', 'img-control')`)


## 2019-11-01
* [Add] Add `menu-state` in localStorage (dublicate)
* [Hot fix] Fix datetime form format


## 2019-10-30
* [Add] Add button for clear filter and order in DataTable
* [Add] Filters state remember
* [Add] Datatables on/off state remember (in config)
* [Add] Add `->setIsolated(false)` for display columns (disabled `htmlspecialchars`)
* [Fix] Fix WYSIWYG error text position
* [Fix] Fix error text style
* [Fix] Fix tooltip initialize (tabs and filters)
* [Fix] Fix `AdminForm::form()` view, add empty class


## 2019-10-27
* [Fix] Fix table footer filter width (select2)
* [Delete] Deleted `setWidth` in `Date` filter
* [Refactor] Refactor date & datetime field in Displays, Forms & Filters
* [Fix] Fix datatables clear filters


## 2019-10-24
* [Add] Tabs state remember
* [Add] Fade transition opacity (0.2s)
* [Delete] Delete clear localStorage in datatables


## 2019-10-23
* [Fix] Fix maximized-card scroll
* [Fix] Fix padding in wysiwyg view
* [Fix] Fix Dependent nullable
* [Fix] Fix Dependent localization
* [Delete] Delete `Contracts\Form\PanelInterface` (deprecated, have alias on `card`)
* [Add] `AdminDisplay::tree()` add `->setCollapsed(true)`


## 2019-10-21
* [Add] Localization validate from SO resources
* [Update] `AdminColumnEditable::datetime('updated_at', 'DateTime')` add datepicker
* [Add] `AdminColumnEditable::date('date', 'Only Date')` add datepicker
* [Fix] In `AdminColumn::images` fix `->setReadonly(true)` for dropzone


## 2019-10-21
* [Fix] Navigation badges (pull-right)
* [Add] Add in config `logo_mini`, `menu_top`
* [Deleted] Title and house icon on top panel


## 2019-10-20
* [Add] Add `->setSmall` in `AdminColumn::custom`
* [Fix] stub section generate
* [Fix] Set default orderable & searchable in Display column
* [Deleted] All `panel` views and classes
* [Fix] Fix Attribute on `AdminColumnEditable` and remake datetime


## 2019-10-14
* [Add] Add class `.th-center` for table / datatables. Change text-align on left
* [Fix] localized `AdminFormElement::selectajax` (partially)


## 2019-10-10
* [Add] Add `.table-light` and `.table-gray`, fix styles `.table-secondary`
* [Add] Add `.table-sm` for no padding top/bottom `td` & `th` in table
* [Fix] Vue-multiselect class
* [Fix] Placeholder color change to `#adb5bd` (sass - $gray-500)
* [Fix] Small (about value) in display color change to `#6c757d` (sass - $gray-600)
* [Change] Change yelds `panel.*` to `card.*` (`panel.*` will be deprecated in future versions)
* [Change] `panel.*` is alias `card.*` in `AdminForm::panel()->`
* [Fix] Fix yield position for filter and action


## 2019-10-09
* [Fix] Delete table-striped in default datatables
* [Add] Add maximize button in wysiwyg
* [Add] All form add class `.card`
* [Fix] Filter and order button size in display
* [Fix] Display width table 100% card


## 2019-10-04
* [Fix] `AdminFormElement::image` add URL link
* [Fix] `AdminFormElement::images` add URL link and sortable
* [Fix] `AdminFormElement::file` fix error
* [Add] `AdminFormElement::files`
  - `->showTitle(bool)` show/hide title field
  - `->showDescription(bool)` show/hide description field
  - `->setTitleRequired(bool)` enable/disable required title
  - `->setDescriptionRequired(bool)` enable/disable required description
* [Feature] `Admin.Messages.prompt(title, message = null, inputPlaceholder = null, inputValue = null, imageUrl = null)`

## 2019-09-30
* [Fix] `AdminColumn::wysiwyg` class
* [Fix] `.dropdown` button style
* [Fix] `.alert` color style
* [Fix] `.content.body` min-height style
* [Change] config `show_editor` on `enable_editor`
* [Fix] Travis test fix
* [Fix] Small fix Scrutinizer
* [Deleted] `AdminColumn::daterange`
* [Fix] `->setVisibilityCondition()`
* [Fix] `->setVisible()` in form
* [Deleted] `->setDisplayed()`


## 2019-09-24
* [Add] Add Bootstrap4 classes `.hidden-xs`, `.hidden-sm`, `.hidden-md`, `.hidden-lg`, `.hidden-xl`
* [Fix] Responsive navbar `.dropdown-menu`
* [Fix] Responsive navbar `#nestable-menu` (tree view)
* [Fix] Checkbox background
* [Feature] Change the color of badges ('`AdminColumn::lists`') depending on the color of the table, and add class for force recolor `.badge-list-primary` or other BS4 color
* [Add] `AdminColumn::boolean` fix `setHtmlAttribute` & third param
* [Add] `AdminColumn::count` fix `setHtmlAttribute` & third param
* [Add] `AdminColumn::datetime` fix `setHtmlAttribute` & third param
* [Add] `AdminColumn::gravatar` fix `setHtmlAttribute` & third param
* [Add] `AdminColumn::image` fix `setHtmlAttribute` & third param
* [Fix] `AdminColumn::link` fix `setHtmlAttribute`
* [Add] `AdminColumn::lists` fix `setHtmlAttribute` & third param
* [Add] `AdminColumn::url` fix `setHtmlAttribute` & third param, add `setIcon('false')`, `setIcon('fas fa-address-book')`, `->setText('Random text', 1)` (or `->setText('created_at')`)
* [Add] `AdminColumn::url('column', 'Title', 'column')` or `->setSmall('Random text', 1)` (or `->setSmall('created_at')`)

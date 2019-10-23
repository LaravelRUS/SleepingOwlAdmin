<p align="center"><h2>[Unreleased] (Only in <code class=" language-php">dev-bs4</code> branch)</h2></p>

## 2019-10-23
* [Fix] fix maximized-card scroll
* [Fix] fix padding in wysiwyg view
* [Fix] Fix Dependent nullable
* [Fix] Fix Dependent localization


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

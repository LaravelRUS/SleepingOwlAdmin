<p align="center"><h2>[Unreleased] (Only in <code class=" language-php">dev-bs4</code> branch)</h2></p>

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

```php
Column::{type}('{field name}', '{column label}')
```

Creates new column and adds it to the current model configuration.

### Supported Types

 - [string](string.html)
 - [lists](lists.html)
 - [count](count.html)
 - [image](image.html)
 - [date](date.html)
 - [action](action.html)
 
### Register Custom Type

See [custom columns](Custom_Columns.html).

### Restrict Column Sort

```php
Column::string('my_field')->sortable(false)
```

### Mark Column as Default Sortable

```php
Column::string('title')->sortableDefault()
```

### Column Appendants

See [column appendants](Column_Appendants.html).
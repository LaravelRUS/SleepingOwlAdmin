Cell content will be date or time value.

```php
Column::date('{field}')
```

**Important**: you must have [intl](http://php.net/manual/en/book.intl.php) php extension installed to use this column.

### Format Date and Time

```php
Column::date('created_at')->format('{date format}', '{time format}')
```

```php
Column::date('created_at')->formatDate('{date format}')
```

```php
Column::date('created_at')->formatTime('{time format}')
```

Supported date and time formats:

 - none
 - full
 - long
 - medium
 - short


Creates time input.

```php
FormItem::timestamp('timestamp', 'DateTime')
```

**Important**: you must have [intl](http://php.net/manual/en/book.intl.php) php extension installed to use this form element.

![](/img/timestamp.png)

### Opened State

![](/img/timestamp_opened.png)

### Display Seconds

```php
FormItem::timestamp('timestamp', 'DateTime')->seconds(true)
```

![](/img/timestamp_with_seconds.png)
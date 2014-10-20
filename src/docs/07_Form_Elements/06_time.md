Creates time input.

```php
FormItem::time('time', 'Time')
```

**Important**: you must have [intl](http://php.net/manual/en/book.intl.php) php extension installed to use this form element.

![](/img/time.png)

### Opened State

![](/img/time_opened.png)

### Display Seconds

```php
FormItem::time('time', 'Time')->seconds(true)
```

![](/img/time_with_seconds.png)
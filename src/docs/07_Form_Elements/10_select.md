Creates select input.

```php
FormItem::select('category_id', 'Category')
```

### Providing Data

With array:

```php
->list(['First', 'Second', 'Third])
```

With enum (use array values as keys):

```php
->enum(['First', 'Second', 'Third])
```

With class:

```php
->list(\Foo\MyModel::class)
```

`MyModel` must implement `public static function getList()` and return array.


![](/img/select.png)

![](/img/select_opened.png)
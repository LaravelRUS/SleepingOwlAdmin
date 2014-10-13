Filter title displays as page subtitle when applied.

### Static Title

```php
ModelItem::filter('category_id')->title('with category filter')
```

### Load Title from Model

```php
ModelItem::filter('category_id')->title()->from(Category::class)
```

It will load `Category` model by provided in query parameter value as id. Field to display as a title is `'title'`.

### Load Title from Model Custom Field

```php
ModelItem::filter('category_id')->title()->from(Category::class, 'label')
```

Default field to display is `'title'`, but you can provide your own.
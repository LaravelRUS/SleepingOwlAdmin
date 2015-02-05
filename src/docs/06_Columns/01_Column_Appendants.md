## Filter

### Filter Appendant

```php
Column::filter('{filter_alias}')->model(\Foo\Model::class)->value('{field to grab filter value from}')
```

It will add filter button to every column cell, that links to model table view filter.

### Filter Appendant in current Model

```php
Column::filter('{filter_alias}'))->value('{field to grab filter value from}')
```

### Example

```php
Column::string('category.title', 'Category')->append(
	Column::filter('category_id')->value('category.id')
)
```

----------

## Url

```php
Column::url('{field to grab url from}')
```

It Will add button to every column cell, that links to provided in model field url.

### Example

```php
Column::string('url', 'Url')->append(
	Column::url('full_url)
)
```
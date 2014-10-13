### Filter by Field


```php
ModelItem::filter('article_category_id')
```

Creates filter by `article_category_id` field. You can add `?article_category_id=5` parameter to the query to filter by field.

### Filter Alias

```php
ModelItem::filter('article_category_id')->as('category')
```

Creates filter by `article_category_id` field, but searches for `category` parameter in query. You can add `?category=5` parameter to the query to filter by field.

### Apply Scope

```php
ModelItem::filter('withEmptyCategories')->scope('withoutCategories')
```

This will apply scope `withoutCategories` (*`scopeWithoutCategories($query)` in model*) to the query.

### Override Query Parameter

```php
ModelItem::filter('title')->as('todo')->value('TODO category')
```

Creates filter by `title` field with `todo` alias. It ignores parameter value from query and overrides it with `'TODO category'`.

**Important:** query parameter must have value. You can\`t access this filter using `categories?todo`, but `categories?todo=1` or `categories?todo=something_else` will work.
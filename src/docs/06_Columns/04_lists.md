Cell content will be list of related models. Used in `many-to-many` relations.

```php
Column::lists('categories.title', 'Categories')
```

It will display list of all category titles associated with current entity.

`categories()` must create `belongs-to-many` relation in this case.
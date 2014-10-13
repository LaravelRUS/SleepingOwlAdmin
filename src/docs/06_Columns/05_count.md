Cell content will be count of related models. Used in `has-many` relations.

```php
Column::count('images')
```

```php
Column::count('images')->append(
	Column::filter('school_id')->model(SchoolImage::class)
)
```

`images()` must create `has-many` relation in this case.
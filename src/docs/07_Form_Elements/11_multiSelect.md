Creates multiple select input.

```php
FormItem::multiSelect('categories', 'Categories')
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

### Providing Selected Items

```php
->value('categories.article_id')
```

![](/img/multiselect.png)

### Saving Data

Create new mutator method in your model. Here is an example:

```php
public function setCategoriesAttribute($categories)
{
	$this->categories()->detach();
	if ( ! $categories) return;
	if ( ! $this->exists) $this->save();
	
	$this->categories()->attach($categories);
}
```

`categories()` method creates `belongs-to-many` relation in this case.
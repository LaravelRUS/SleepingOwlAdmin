Your models can extend `SleepingOwl\Models\SleepingOwlModel`. It gives you some benefits:

### Validation
 
Validation method included. You dont need to implement it by yourself. For details see [validation](../Getting_Started/Validation.html).

### Default Order

Override `scopeDefaultSort($query)` to set your own default sort for this model.
 
```php
class Person extends SleepingOwlModel
{
	public function scopeDefaultSort($query)
	{
		return $query->orderBy('last_name', 'asc');
	}
}
```

Now you can use

```php
Person::all()
```

and results will be ordered by last name.

If you want to override order you can use

```php
Person::withoutOrders()
```

to get query builder without default order.

### Random Entity

```php
Person::random()
```

Returns random entity.

### Delete All

You can delete all entities with your deletion logic (*deleting stored images, files or related entities*).

```php
MyModel::deleteAll()
```

### Supported Date Formats

Eloquent cant automatically parse custom date format into database date format. If your class extends `SleepingOwlModel` you can use any date format PHP supports.
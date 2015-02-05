SleepingOwl Admin model configurations must be stored within `bootstrapDirectory` (*default: `app/admin`*).

You can store all your model configurations in one file or split it as you want.

Here is example how your model configuration might look like:

```php
Admin::model(\App\District::class)
	->title('City Districts')
	->with('streets', 'schools', 'city')
	->filters(function ()
{
	ModelItem::filter('city_id')->title()->from(\App\City:class);
})
	->columns(function ()
{
	Column::string('title', 'Title');
	Column::string('city.title', 'City')
		->append(Column::filter('city_id')->value('city.id'));
	Column::string('stub', 'Url stub');
	Column::count('streets', 'Streets')
		->append(Column::filter('district_id')->model(\App\Street::class));
})
	->form(function ()
{
	FormItem::text('title', 'Title');
	FormItem::text('url', 'Url stub');
	FormItem::text('zoom', 'Zoom level');
	FormItem::text('latitude', 'Center (latitude)');
	FormItem::text('longitude', 'Center (longitude)');
	FormItem::view('admin.districts.my_custom_view_with_script');
});
```

### Provide Model

```php
Admin::model(\Foo\Bar\Model::class)
```

Or if you are running PHP under 5.5 you can use strings:

```php
Admin::model('\Foo\Bar\Model')
```

### Set Title

```php
->title('My Model Title')
```

Title will be displayed in headers and menu label.

### Set Alias

```php
->as('districts')
```

Alias will be used in urls. Default alias is lowercase plural form of model class.

### Set Async mode

```php
->async()
```

You can enable async mode (default is disabled).

### Each Column Filter

```php
->columnFilter()
```

This will add filter input field at the bottom of each column that will filter only this column values.

### Eager Loading

```php
->with('city', 'schools')
```

Or you can provide arguments as an array:

```php
->with(['city', 'schools'])
```

Model will be loaded with this relations.

### Restrict Creating

You can deny creating new entities at all:

```php
->denyCreating()
```

or provide a callback to decide:

```php
->denyCreating(function ()
{
	return (date('d') <= 15); // deny creating in first 15 days of month
})
```

### Restrict Editing and Deleting

You can deny editing and/or deleting at all:

```php
->denyEditing()
```

```php
->denyDeleting()
```

```php
->denyEditingAndDeleting()
```

or provide a callback to decide:

```php
->denyEditing(function ($instance)
{
	return ($instance->title === 'Dont edit this'); // deny editing of entities by condition
})
```

```php
->denyEditingAndDeleting(function ($instance)
{
	return ($instance->id == 1);
})
```

### Filters

```php
->filters(function ()
{
	// create filters for this model here
})
```

For details see [filters](../Filters/Overview.html).

### Columns

```php
->columns(function ()
{
	// create columns for this model here
})
```

For details see [columns](../Columns/Overview.html).

### Form

```php
->form(function ()
{
	// create form for this model here
})
```

For details see [form elements](../Form_Elements/Overview.html).
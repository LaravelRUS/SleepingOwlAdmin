You can register your own column types in `bootstrap.php` file within `bootstrapDirectory` (*default is `app/admin/bootstrap.php`*).

```php
Column::register('{type}', \Foo\Bar\MyColumn::class)
```

Your class must implement `SleepingOwl\Admin\Columns\Interfaces\ColumnInterface`.

### Example

bootstrap.php

```php
Column::register('yesNo', \Acme\YesNoColumn::class)
```

Acme/YesNoColumn.php

```php
use SleepingOwl\Admin\Columns\Interfaces\ColumnInterface;

class YesNoColumn implements ColumnInterface
{

	public function renderHeader()
	{
		return '<th>Yes/no</th>';
	}

	public function render($instance, $totalCount)
	{
		$content = ($instance->bool) ? 'yes' : 'no';
		return '<td>' . $content . '</td>';
	}

	public function isHidden()
	{
		// return false to display this column
		// return true to hide this column (used for column appendants)
		return false;
	}
	
	public function myCustomMethod()
	{
	}

}
```

Usage in model configuration

```php
->columns(function ()
{
	Column::yesNo()->myCustomMethod();
})
```
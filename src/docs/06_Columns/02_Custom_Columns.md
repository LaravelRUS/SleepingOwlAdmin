You can register your own column types in `bootstrap.php` file within `bootstrapDirectory` (*default is `app/admin/bootstrap.php`*).

```php
Column::register('{type}', \Foo\Bar\MyColumn::class)
```

Your class must implement `SleepingOwl\Admin\Columns\Interfaces\ColumnInterface` or extend `SleepingOwl\Admin\Columns\Column\BaseColumn` class.

### Example

bootstrap.php

```php
Column::register('yesNo', \Acme\YesNoColumn::class)
```

#### 1. Acme/YesNoColumn.php using interface implementation

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
	
	public function getName()
	{
		return 'columng-name';
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

#### 2. Acme/YesNoColumn.php using BaseColumn extend

```php
use SleepingOwl\Admin\Columns\Column\BaseColumn;

class YesNoColumn extends BaseColumn
{

	public function render($instance, $totalCount)
	{
		$content = ($instance->{$this->name}) ? 'yes' : 'no';
		return parent::render($instance, $totalCount, $content);
	}

}
```

Usage in model configuration

```php
->columns(function ()
{
	Column::yesNo('bool', 'Label')->sortable(false);
})
```

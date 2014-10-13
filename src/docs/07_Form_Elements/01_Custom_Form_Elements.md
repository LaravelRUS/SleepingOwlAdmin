You can register your own form elements in `bootstrap.php` file within `bootstrapDirectory` (*default is `app/admin/bootstrap.php`*).

```php
FormItem::register('{type}', \Foo\Bar\MyColumn::class)
```

Your class must implement `SleepingOwl\Admin\Models\Form\Interfaces\FormItemInterface`.

```php
FormItem::register('{type}', function ($instance)
{
	// implement your form element code here
	if ($instance->exists)
	{
		// creating form
	} else
	{
		// editing form
	}
	return 'my element';
})
```

### Adding Custom Scripts and Styles

You can add custom scripts and styles to the page header, that uses your custom form element.

```php
FormItem::register('my', function ($instance)
{
	AssetManager::addScript(URL::asset('js/my.js'));
	AssetManager::addScript('//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js');
	AssetManager::addStyle(URL::asset('css/my.css'));
	
	return 'anything';
})
```

### Example using Closure

bootstrap.php

```php
FormItem::register('myItem', function ($instance)
{
	if ($instance->exists)
	{
		return 'You are creating new entity.';
	} else
	{
		return 'You are editing existing entity.';
	}
})
```

Usage in model configuration

```php
->form(function ()
{
	FormItem::myItem();
})
```

You can\`t provide additional data to your form element using closure. If you want more flexible solution - use classes instead.

### Example using Class

bootstrap.php

```php
FormItem::register('myItem', \Acme\MyItem::class)
```

Acme/MyItem.php

```php
use SleepingOwl\Admin\Models\Form\Interfaces\FormItemInterface;

class MyItem implements FormItemInterface
{

	protected $label;

	public function render()
	{
		$instance = Admin::instance()->formBuilder->getModel();
		if ($instance->exists)
		{
			return "You are creating new {$this->label}.";
		} else
		{
			return "You are editing existing {$this->label}.";
		}
	}
	
	public function setLabel($label)
	{
		$this->label = $label;
		return $this;
	}

}
```

Usage in model configuration

```php
->form(function ()
{
	FormItem::myItem()->setLabel('category');
})
```
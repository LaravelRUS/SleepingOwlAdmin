SleepingOwl Admin menu configuration default placement is in `app/admin/menu.php`.

Here is simple example how your menu configuration might look like:

```
Admin::menu()->url('/')->label('Start Page')->icon('fa-dashboard')->uses('\App\HTTP\Controllers\AdminController@getIndex');
Admin::menu(\App\User::class)->icon('fa-user');
Admin::menu()->label('Subitems')->icon('fa-book')->items(function ()
{
	Admin::menu(\Acme\Models\Bar\User::class)->icon('fa-user');
	Admin::menu(\Acme\Models\Foo::class)->label('my label');
});
```
	
### Create Menu Item for Model

```php
Admin::menu(\Foo\Bar\Model::class)
```

If you are running PHP under 5.5 you can use strings:

```php
Admin::menu('\Foo\Bar\Model')
```

Model must be registered in SleepingOwl Admin. For details see [model configuration](Model_Configuration.html).

Label for this menu item will be model title, but you can provide custom label using `label()` method.

Url for this item will be a link to the model.

### Create Menu Item for Custom Controller Action

```php
Admin::menu()->url('my-url')->uses('\App\HTTP\Controllers\MyController@getAction')
```

You must provide url for this item using `url()` and controller action using `uses()`.

### Set Label

```php
->label('My Label')
```

### Set Icon

```php
->icon('fa-bank')
```

You can use [Font Awesome 4.1.0](http://fontawesome.io) icon classes.

### Nested Menus

```php
->items(function()
{
	// ...
})
```

You can create submenus. There is no depth limit.
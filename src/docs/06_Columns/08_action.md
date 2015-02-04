Cell content will be button with custom action.

```php
Column::action('{name}', '{label}')
```

### Button Styling

You can specify icon class to use (from FontAwesome):

```php
Column::action('show', 'Label')->icon('fa-globe')
```

2 styles are available: `short` and `long`

```php
 # This will create button without label, only with icon. Label will popup on hover.
Column::action('show', 'Label')->icon('fa-globe')->style('short')

 # This will create button with icon and label
Column::action('show', 'Label')->icon('fa-globe')->style('long')
```

**Defaults:** default style is `long` without icon.

### Button Target

You can specify target for button:

```php
Column::action('show', 'Label')->url('http://test.com/:id')->target('_blank')
```

### URL Usage

You can specify url for button, `:id` will be replaced for the clicked row id:

```php
Column::action('show', 'Label')->url('http://test.com/:id')
```

or you can provide callback to generate url:

```php
Column::action('show', 'Label')->url(function ($instance)
{
	return URL::route('my-route', [$instance->id]);
})
```

### Custom Actions Usage

Use `->callback()` method to set custom action:

```php
Column::action('show', 'Label')->callback(function ($instance)
{
	# Any code you want
})
```

Closure can return redirect:

```php
Column::action('show', 'Label')->callback(function ($instance)
{
	return Redirect::route('my-route', [$instance->id]);
})
```

*Note:* If there is no return statement in your closure user will be redirected back.
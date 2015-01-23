```php
FormItem::{type}('{field name}', '{label}')
```

Creates new form element and adds it to the current model configuration.

### Supported Types

 - [text](text.html)
 - [textAddon](textAddon.html)
 - [checkbox](checkbox.html)
 - [date](date.html)
 - [time](time.html)
 - [timestamp](timestamp.html)
 - [file](file.html)
 - [image](image.html)
 - [select](select.html)
 - [multiSelect](multiSelect.html)
 - [textarea](textarea.html)
 - [ckeditor](ckeditor.html)
 - [view](view.html)
 
### Validation

```php
FormItem::text('title')->required()->unique()->validationRule('my-custom-rule')
```

See [details](../Getting_Started/Validation.html) about validation.

### Custom HTML attributes

You can add custom html attributes to the form element.

```php
FormItem::text('title')->attributes(['class' => 'my-class', 'my-attribute' => 1])
```

### Register Custom Type

See [custom form elements](Custom_Form_Elements.html).
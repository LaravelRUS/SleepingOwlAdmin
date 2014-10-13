If you want to use SleepingOwl Admin file form element you must prepare your model:
 - Implement `SleepingOwl\Models\Interfaces\ModelWithFileFieldsInterface` in your model.
 - Add `SleepingOwl\Models\Traits\ModelWithImageOrFileFieldsTrait` trait (*if your model extends `SleepingOwlModel` you dont have to add the trait*).
 - Add `public function getFileFields()`.
 
### Example 

```php
<?php

use SleepingOwl\Models\Interfaces\ModelWithFileFieldsInterface;
use SleepingOwl\Models\Traits\ModelWithImageOrFileFieldsTrait;

class Document extends \Eloquent implements ModelWithFileFieldsInterface
{
	use ModelWithImageOrFileFieldsTrait;
	
	public function getFileFields()
	{
		return [
			'file' => 'documents/',
		];
	}
}
```

### Provide File Fields

`getFileFields()` must return array, where keys is model file fields and values is path to directory within `filesDirectory` (*see [configuration](../Getting_Started/Configuration.html)*).

If path is empty files will be stored in `filesDirectory`.

### Field Usage

Accessing fields of your model

```php
$document->file
```

will return instance of `SleepingOwl\Models\Attributes\File`.

You can use

```php
$document->file->link()
```

to get frontend url to file.
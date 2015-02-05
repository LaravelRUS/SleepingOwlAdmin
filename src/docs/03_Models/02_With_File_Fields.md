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
			'other' => ['other_files/', function($directory, $originalName, $extension)
			{
				return $originalName;
			}]
		];
	}
}
```

### Provide File Fields

`getFileFields()` must return array, where keys is model file fields and values is path to directory within `filesDirectory` (*see [configuration](../Getting_Started/Configuration.html)*).

If path is empty files will be stored in `filesDirectory`.

### Custom File Naming Function

Array value can be either string or array:

- `string` &mdash; directory to upload files to, filename generates randomly.
- `array` &mdash; first item in array is directory to upload files to, second item is naming function closure (`function($directory, $originalName, $extension){}`). Closure must return new filename for the uploaded file.
	- `$directory` &mdash; absolute path to the upload directory
	- `$originalName` &mdash; uploaded file original name
	- `$extension` &mdash; uploaded file extension

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
If you want to use SleepingOwl Admin image column or form element you must prepare your model:
 - Implement `SleepingOwl\Models\Interfaces\ModelWithImageFieldsInterface` in your model.
 - Add `SleepingOwl\Models\Traits\ModelWithImageOrFileFieldsTrait` trait (*if your model extends `SleepingOwlModel` you dont have to add the trait*).
 - Add `public function getImageFields()`.
 
### Example 

```php
<?php

use SleepingOwl\Models\Interfaces\ModelWithImageFieldsInterface;
use SleepingOwl\Models\Traits\ModelWithImageOrFileFieldsTrait;

class Monument extends \Eloquent implements ModelWithImageFieldsInterface
{
	use ModelWithImageOrFileFieldsTrait;
	
	public function getImageFields()
	{
		return [
			'image' => 'monuments/',
			'photo' => '',
			'other' => ['other_images/', function($directory, $originalName, $extension)
			{
				return $originalName;
			}]
		];
	}
}
```

### Provide Image Fields

`getImageFields()` must return array, where keys is model image fields and values is path to directory within `imagesDirectory` (*see [configuration](../Getting_Started/Configuration.html)*).

If path is empty images will be stored in `imagesDirectory`.

### Custom File Naming Function

Array value can be either string or array:

- `string` &mdash; directory to upload images to, filename generates randomly.
- `array` &mdash; first item in array is directory to upload images to, second item is naming function closure (`function($directory, $originalName, $extension){}`). Closure must return new filename for the uploaded file.
	- `$directory` &mdash; absolute path to the upload directory
	- `$originalName` &mdash; uploaded file original name
	- `$extension` &mdash; uploaded file extension

### Field Usage

Accessing fields of your model

```php
$monument->image
```

will return instance of `SleepingOwl\Models\Attributes\Image`.

You can use

```php
$monument->image->thumbnail('original')
```

to get frontend url to image with original size.

You can create your own image resizing templates in `app/config/packages/intervention/imagecache/config.php`. For details see [Intervention Imagecache](http://image.intervention.io/).
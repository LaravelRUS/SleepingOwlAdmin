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
			'photo' => ''
		];
	}
}
```

### Provide Image Fields

`getImageFields()` must return array, where keys is model image fields and values is path to directory within `imagesDirectory` (*see [configuration](../Getting_Started/Configuration.html)*).

If path is empty images will be stored in `imagesDirectory`.

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
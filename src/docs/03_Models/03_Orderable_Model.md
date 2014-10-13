Orderable model &mdash; model, that contains integer field that represents order of entities.

You can add &uarr; and &darr; buttons to table view to move entities up and down.

### How To Make Your Orderable Model

 - Implement `SleepingOwl\Models\Interfaces\ModelWithOrderFieldInterface` interface in your model.
 - Add `SleepingOwl\Models\Traits\ModelWithOrderFieldTrait` trait.
 - Default order field name is `sort`. If you have other name add `getSortField()` method to your model.
 
### Example

```php
use SleepingOwl\Models\SleepingOwlModel;
use SleepingOwl\Models\Interfaces\ModelWithOrderFieldInterface;
use SleepingOwl\Models\Traits\ModelWithOrderFieldTrait;

class Category extends SleepingOwlModel implements ModelWithOrderFieldInterface
{
	use ModelWithOrderFieldTrait;
	
	public function getSortField()
	{
		return 'sort_field';
	}
}
```
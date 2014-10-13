The easiest way to perform validation in you models is to extend `SleepingOwl\Models\SleepingOwlModel`. You must implement `getValidationRules()` method in your model, that must return validation rules, and thats all.

The other way is to implement `SleepingOwl\Models\Interfaces\ValidationModelInterface` interface. It declares 2 methods: `validate($data)` and `getValidationRules()`. You must manually write validation there. If validation fails method must throw `SleepingOwl\Admin\Exceptions\ValidationException`.

### New Validation Rules

 - `url_stub` &ndash; check if field is valid url stub (without slashes)
 - `url_stub_full` &ndash; check if field is valid url stub (with slashes)
 - `required_only_on_create` &ndash; field required only on new entity creation, usefull for image field

### Updated Validation Rules

 - `unique` &ndash; same as laravel 'unique', but automatically exclude current entity from search. *(works only if your model extends `SleepingOwlModel`)*

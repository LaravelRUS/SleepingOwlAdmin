There is two easy ways to perform validation in your models, you can combine them if you want. And there is one hard way. First of all you must extend your models from `SleepingOwl\Models\SleepingOwlModel`.

## Easy Ways

### 1. In Form Elements

You can add validation rules to your form elements:

```php
FormItem::text('title')->required()->unique()->validationRule('my-custom-rule')
```

`required()` accepts one parameter: `true` if required only on create, `false` if always required. No parameter equals `false`.

Use `unique()` to set this field to be unique in this model.

You can use `validationRule($rule)` to add any rule you want. You can use pipe delimiter `|`.

### 2. In Your Model

You can implement `public function getValidationRules()` method in your model, that must return validation rules, and thats all.

## Hard Way

The other way is to implement `SleepingOwl\Models\Interfaces\ValidationModelInterface` interface. It declares 2 methods: `validate($data)` and `getValidationRules()`. You must manually write validation there. If validation fails method must throw `SleepingOwl\Admin\Exceptions\ValidationException`.

## New Validation Rules

 - `url_stub` &ndash; check if field is valid url stub (without slashes)
 - `url_stub_full` &ndash; check if field is valid url stub (with slashes)
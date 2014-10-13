Use this command to create new model configuration. For details see [model configuration](../Getting_Started/Model_Configuration.html).

You can specify model title and columns for table view. Form elements will be grabbed from your model table structure.

### Usage

```bash
$ php artisan admin:model "\Foo\MyModel" --title="My Model Title" --columns="title, image, date, entries"
```
```bash
$ php artisan admin:model Foo/MyModel --columns="title,image,date,entries"
```

### Arguments

#### modelClass

Provide full model class name with namespace. You can write it in quotes with backslash or without quotes with forward slash.

### Options

#### --title

Set title for your model.

#### --columns

Comma-separated list of all columns in table view. Type of columns will be guessed from your model.

### What It Does

This command creates new file with model configuration within `bootstrapDirectory`, called `{modelClass}.php`. Eager relations, column types, filters and form elements will be guessed from provided data, your model class and database structure.

### Column Type Guesser

 - [image](../Columns/image.html) &ndash; if model implements `ModelWithImageFieldsInterface` and this column marked as image field. See details in [Model With Image Fields](../Models/With_Image_Fields.html).
 - [count](../Columns/count.html) &ndash; if model has relation `has-many` on this field.
 - [lists](../Columns/lists.html) &ndash; if model has relation `belongs-to-many` on this field (*you must provide field to display in list, e.g. `entries.title`, where `entries` is you eager relation*).
 - [date](../Columns/date.html) &ndash; if this column has `date`, `time` or `timestamp` type in database.
 - [string](../Columns/string.html) &ndash; in other cases.
 
### Form Element Guesser

 - [image](../Form_Elements/image.html) &ndash; if model implements `ModelWithImageFieldsInterface` and this field marked as image field. See details in [Model With Image Fields](../Models/With_Image_Fields.html).
 - [file](../Form_Elements/file.html) &ndash; if model implements `ModelWithFileFieldsInterface` and this field marked as file field. See details in [Model With File Fields](../Models/With_File_Fields.html).
 - [select](../Form_Elements/select.html) &ndash; if model has `belongs-to` relation on this field or this field is enum.
 - [text](../Form_Elements/text.html) &ndash; if field type in database is `varchar`, `int` or `float`.
 - [ckeditor](../Form_Elements/ckeditor.html) &ndash; if field type in database is `text`.
 - [checkbox](../Form_Elements/checkbox.html) &ndash; if field type in database is `boolean` (*`tinyint(1)`*).
 - [date](../Form_Elements/date.html) &ndash; if field type in database is `date`.
 - [time](../Form_Elements/time.html) &ndash; if field type in database is `time`.
 - [timestamp](../Form_Elements/timestamp.html) &ndash; if field type in database is `timestamp`.
 

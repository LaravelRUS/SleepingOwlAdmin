Cell content will be simple field value from your model or one of related models.

```php
Column::string('{field name}', '{column label}')
```

### Field Name

Field name can be one of the following:
 
 - Field from your model (from database or using mutators).
 
 ```php
 Column::string('title')
 ```

 ```php
 Column::string('url')
 ```
 
 - Field from your model relations
 
 ```php
 Column::string('category.title') // category() creates belongs-to relation
 ```
 
 ```php
 Column::string('city.state.title') // you can use nested relations
 ```
 
### Order by Custom Value

```php
Column::string('full_name')->orderBy('last_name')
```

Displays `full_name` as cell content, but orders by `last_name`.
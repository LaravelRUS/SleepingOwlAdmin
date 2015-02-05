[Install command](../Commands/Install.html) publishes SleepingOwl Admin config automatically. If you want to publish config manually you must run this command in terminal:

```bash
$ php artisan vendor:publish --provider="SleepingOwl\Admin\AdminServiceProvider" --tag="config"
```

## Config Attributes

### title

String to display in page title and header.

### prefix

Url prefix for admin module.

Default: `admin`

### beforeFilters

Filters that protects admin module from unauthorized users

Default: `['admin.auth']`

### bootstrapDirectory

Path to SleepingOwl Admin bootstrap directory. You must place your models configuration, menu configuration, custom columns and form elements there. Every `.php` file in that directory will be included.

Default: `app_path('admin')`

### imagesDirectory

Path to images directory. Images from [image form elements](../Form_Elements/image.html) will be uploaded there.

Default: `public_path('images')`

### filesDirectory

Path to files directory. Files from [file form elements](../Form_Elements/file.html) will be uploaded there.

Default: `public_path('files')`

### imagesUploadDirectory

Path to images upload directory within `imagesDirectory`. CKEditor will upload images there.

Default: `'uploads'`
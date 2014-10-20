 1. Require this package in your composer.json and run composer update (or run `composer require sleeping-owl/admin:1.x` directly):

	```json
	"sleeping-owl/admin": "1.*"
	```

 2. After composer update, add service providers to the `app/config/app.php`

	    'SleepingOwl\Admin\AdminServiceProvider',

 3. Add this to the facades in `app/config/app.php`:

		'Admin'				=> 'SleepingOwl\Admin\Admin',
		'AdminAuth'			=> 'SleepingOwl\AdminAuth\Facades\AdminAuth',
		'AssetManager' 		=> 'SleepingOwl\Admin\AssetManager\AssetManager',
		'Column'   			=> 'SleepingOwl\Admin\Columns\Column',
		'FormItem' 			=> 'SleepingOwl\Admin\Models\Form\FormItem',
		'ModelItem'			=> 'SleepingOwl\Admin\Models\ModelItem',

 4. Run this command in terminal (if you want to know what exactly this command makes, see [install command documentation](../Commands/Install.html)):

	```bash
	$ php artisan admin:install
	```
 5. All done! Now go to the `<your_site_url>/admin` and use default credentials `admin` / `SleepingOwl`.
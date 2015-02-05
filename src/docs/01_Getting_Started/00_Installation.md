 1. Require this package in your composer.json and run composer update (or run `composer require sleeping-owl/admin:2.x` directly):

	```json
	"sleeping-owl/admin": "2.*"
	```

 2. After composer update, add service providers to the `config/app.php`

	    'SleepingOwl\Admin\AdminServiceProvider',
	    'Illuminate\Html\HtmlServiceProvider',

 3. Add this to the facades in `config/app.php`:

		'Admin'				=> 'SleepingOwl\Admin\Admin',
		'AdminAuth'			=> 'SleepingOwl\AdminAuth\Facades\AdminAuth',
		'AssetManager' 		=> 'SleepingOwl\Admin\AssetManager\AssetManager',
		'Column'   			=> 'SleepingOwl\Admin\Columns\Column',
		'FormItem' 			=> 'SleepingOwl\Admin\Models\Form\FormItem',
		'ModelItem'			=> 'SleepingOwl\Admin\Models\ModelItem',
		
		'Form'      => 'Illuminate\Html\FormFacade',
		'Html'      => 'Illuminate\Html\HtmlFacade',

 4. Run this command in terminal (if you want to know what exactly this command makes, see [install command documentation](../Commands/Install.html)):

	```bash
	$ php artisan admin:install
	```
 5. All done! Now go to the `<your_site_url>/admin` and use default credentials `admin` / `SleepingOwl`.
<?php

namespace SleepingOwl\Admin\Providers;

use Route;
use SleepingOwl\Admin\Admin;
use KodiCMS\Navigation\Navigation;
use Symfony\Component\Finder\Finder;
use SleepingOwl\Admin\Filter\Filter;
use SleepingOwl\Admin\Form\AdminForm;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\FormItems\FormItem;
use SleepingOwl\Admin\Display\AdminDisplay;
use SleepingOwl\Admin\Facades\AdminSection;
use SleepingOwl\Admin\Facades\AdminTemplate;
use SleepingOwl\Admin\Facades\AdminNavigation;
use SleepingOwl\Admin\Column\Filter\ColumnFilter;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AdminServiceProvider extends ServiceProvider
{
    protected $directory;

    public function register()
    {
        $this->app->singleton('sleeping_owl', function () {
            return new Admin();
        });

        $this->app->singleton('sleeping_owl.navigation', function () {
            $items = [];
            if (file_exists($navigation = config('sleeping_owl.bootstrapDirectory').DIRECTORY_SEPARATOR.'navigation.php')) {
                $items = include $navigation;
            }

            return new Navigation($items);
        });

        $this->registerAliases();
    }

    public function boot()
    {
        $this->app->singleton('sleeping_owl.template', function () {
            return $this->app['sleeping_owl']->template();
        });

        $this->registerBootstrap();
        $this->registerPatterns();
    }

    /**
     * @return array
     */
    protected function registerBootstrap()
    {
        $directory = config('sleeping_owl.bootstrapDirectory');

        if (! is_dir($directory)) {
            return;
        }

        $files = $files = Finder::create()
            ->files()
            ->name('/^.+\.php$/')
            ->notName('routes.php')
            ->notName('navigation.php')
            ->in($directory)->sort(function ($a) {
                return $a->getFilename() != 'bootstrap.php';
            });


        foreach ($files as $file) {
            require $file;
        }
    }

    protected function registerPatterns()
    {
        Route::pattern('adminModelId', '[0-9]+');

        $aliases = $this->app['sleeping_owl']->modelAliases();

        if (count($aliases) > 0) {
            Route::pattern('adminModel', implode('|', $aliases));

            Route::bind('adminModel', function ($model) use ($aliases) {
                $class = array_search($model, $aliases);
                if ($class === false) {
                    throw new ModelNotFoundException;
                }

                return $this->app['sleeping_owl']->getModel($class);
            });
        }

        Route::pattern('adminWildcard', '.*');
    }

    public function registerAliases()
    {
        AliasLoader::getInstance([
            'AdminSection'      => AdminSection::class,
            'AdminTemplate'     => AdminTemplate::class,
            'AdminNavigation'   => AdminNavigation::class,
            'AdminColumn'       => Column::class,
            'AdminColumnFilter' => ColumnFilter::class,
            'AdminFilter'       => Filter::class,
            'AdminForm'         => AdminForm::class,
            'AdminFormItem'     => FormItem::class,
            'AdminDisplay'      => AdminDisplay::class
        ]);
    }
}
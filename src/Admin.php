<?php

namespace SleepingOwl\Admin;

use Closure;
use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Navigation\Page;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Model\ModelCollection;
use Illuminate\Foundation\ProviderRepository;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;
use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Http\Controllers\AdminController;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

class Admin implements AdminInterface
{
    /**
     * @var ModelConfigurationInterface[]|ModelCollection
     */
    protected $models;

    /**
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @var Application
     */
    protected $app;

    /**
     * Admin constructor.
     *
     * @param Application $application
     */
    public function __construct(Application $application)
    {
        $this->app = $application;
        $this->models = new ModelCollection();

        $this->registerBaseServiceProviders();
        $this->registerCoreContainerAliases();
    }

    /**
     * @param TemplateInterface $template
     */
    public function setTemplate(TemplateInterface $template)
    {
        $this->template = $template;
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        $this->template->initialize();
    }

    /**
     * @param string $class
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function registerModel($class, Closure $callback = null)
    {
        $this->register($model = $this->app->make(ModelConfiguration::class, ['class' => $class]));

        if (is_callable($callback)) {
            call_user_func($callback, $model);
        }

        return $this;
    }

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function register(ModelConfigurationInterface $model)
    {
        $this->setModel($model->getClass(), $model);

        if ($model instanceof Initializable) {
            $model->initialize();
        }

        return $this;
    }

    /**
     * @param string $class
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function setModel($class, ModelConfigurationInterface $model)
    {
        $this->models->put($class, $model);

        return $this;
    }

    /**
     * @param string|Model $class
     * @return ModelConfigurationInterface
     */
    public function getModel($class)
    {
        if (is_object($class)) {
            $class = get_class($class);
        }

        if (! $this->hasModel($class)) {
            $this->registerModel($class);
        }

        return $this->models->get($class);
    }

    /**
     * @return ModelConfigurationInterface[]|ModelCollection
     */
    public function getModels()
    {
        return $this->models;
    }

    /**
     * @param string $class
     *
     * @return bool
     */
    public function hasModel($class)
    {
        return $this->models->has($class);
    }

    /**
     * @return NavigationInterface
     */
    public function navigation()
    {
        return $this->template()->navigation();
    }

    /**
     * @return MetaInterface
     */
    public function meta()
    {
        return $this->template()->meta();
    }

    /**
     * @return TemplateInterface
     */
    public function template()
    {
        return $this->template;
    }

    /**
     * @param string $class
     * @param int    $priority
     *
     * @return Page
     */
    public function addMenuPage($class = null, $priority = 100)
    {
        return $this->getModel($class)->addToNavigation($priority);
    }

    /**
     * @return Navigation
     *
     * @deprecated
     */
    public function getNavigation()
    {
        return $this->navigation();
    }

    /**
     * @param string|Renderable $content
     * @param string|null       $title
     *
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function view($content, $title = null)
    {
        return $this->app[AdminController::class]->renderContent($content, $title);
    }

    /**
     * Register all of the base service providers.
     *
     * @return void
     */
    protected function registerBaseServiceProviders()
    {
        $providers = [
            \SleepingOwl\Admin\Providers\AliasesServiceProvider::class,
            \Collective\Html\HtmlServiceProvider::class,
            \DaveJamesMiller\Breadcrumbs\ServiceProvider::class,
            \SleepingOwl\Admin\Providers\AdminServiceProvider::class,
        ];

        /* Workaround to allow use ServiceProvider-based configurations in old fashion */
        if (is_file(app_path('Providers/AdminSectionsServiceProvider.php'))) {
            $providers[] = $this->app->getNamespace().'Providers\\AdminSectionsServiceProvider';
        }

        $manifestPath = $this->app->bootstrapPath().'/cache/sleepingowladmin-services.php';

        (new ProviderRepository($this->app, new Filesystem(), $manifestPath))->load($providers);
    }

    /**
     * Register the core class aliases in the container.
     *
     * @return void
     */
    protected function registerCoreContainerAliases()
    {
        $aliases = [
            'sleeping_owl' => ['SleepingOwl\Admin\Admin', 'SleepingOwl\Admin\Contracts\AdminInterface'],
            'sleeping_owl.template' => ['SleepingOwl\Admin\Contracts\Template\TemplateInterface'],
            'sleeping_owl.widgets' => ['SleepingOwl\Admin\Contracts\Widgets\WidgetsRegistryInterface', 'SleepingOwl\Admin\Widgets\WidgetsRegistry'],
            'sleeping_owl.message' => ['SleepingOwl\Admin\Widgets\Messages\MessageStack'],
            'sleeping_owl.navigation' => ['SleepingOwl\Admin\Navigation', 'SleepingOwl\Admin\Contracts\Navigation\NavigationInterface'],
            'sleeping_owl.wysiwyg' => ['SleepingOwl\Admin\Wysiwyg\Manager', 'SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygMangerInterface'],
            'sleeping_owl.meta' => ['assets.meta', 'SleepingOwl\Admin\Contracts\Template\MetaInterface', 'SleepingOwl\Admin\Templates\Meta'],
        ];

        foreach ($aliases as $key => $aliases) {
            foreach ($aliases as $alias) {
                $this->app->alias($key, $alias);
            }
        }
    }
}

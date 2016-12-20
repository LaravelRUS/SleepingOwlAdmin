<?php

namespace SleepingOwl\Admin;

use Closure;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Navigation\Page;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\AdminInterface;
use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Http\Controllers\AdminController;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

class Admin implements AdminInterface
{
    /**
     * @var ModelConfigurationInterface[]|Collection
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
     * @param TemplateInterface $template
     */
    public function __construct(TemplateInterface $template, Application $application)
    {
        $this->template = $template;
        $this->app = $application;
        $this->models = new Collection();
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        $this->template()->initialize();
    }

    /**
     * @return Collection
     */
    public function aliases()
    {
        return $this->models->keys();
    }

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function register(ModelConfigurationInterface $model)
    {
        $this->setModel($model->getAlias(), $model);

        if ($model instanceof Initializable) {
            $model->initialize();
        }

        return $this;
    }

    /**
     * @param string $alias
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function registerModel($alias, Closure $callback = null)
    {
        $this->register($model = $this->app->make(ModelConfiguration::class, [$alias]));

        if (is_callable($callback)) {
            call_user_func($callback, $model);
        }

        return $this;
    }

    /**
     * @param string|Model $class
     *
     * @return ModelConfigurationInterface|null
     */
    public function getModelByClass($class)
    {
        if (is_object($class)) {
            $class = get_class($class);
        }

        return $this->models->filter(function (ModelConfigurationInterface $modelConfiguration) use ($class) {
            return $modelConfiguration->getClass() == $class;
        })->first();
    }

    /**
     * @param string $alias
     * @return ModelConfigurationInterface|null
     */
    public function getModel($alias)
    {
        if (! $this->hasModel($alias)) {
            $this->registerModel($alias);
        }

        return $this->models->get($alias);
    }

    /**
     * @return ModelConfigurationInterface[]|Collection
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
     * @param string             $class
     * @param ModelConfigurationInterface $model
     */
    public function setModel($class, ModelConfigurationInterface $model)
    {
        $this->models->put($class, $model);
    }

    /**
     * @return \SleepingOwl\Admin\Contracts\Template\TemplateInterface
     */
    public function template()
    {
        return $this->template;
    }

    /**
     * @return NavigationInterface
     */
    public function navigation()
    {
        return $this->template->navigation();
    }

    /**
     * @return MetaInterface
     */
    public function meta()
    {
        return $this->template->meta();
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
     * @param string|Renderable $content
     * @param string|null       $title
     *
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function view($content, $title = null)
    {
        return $this->app->make(AdminController::class)->renderContent($content, $title);
    }
}

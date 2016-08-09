<?php

namespace SleepingOwl\Admin;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Http\Controllers\AdminController;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Navigation\Page;

class Admin implements AdminInterface
{
    /**
     * @var ModelConfigurationInterface[]
     */
    protected $models = [];

    /**
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @var Page[]
     */
    protected $menuItems = [];

    /**
     * Admin constructor.
     *
     * @param TemplateInterface $template
     */
    public function __construct(TemplateInterface $template)
    {
        $this->template = $template;
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        $this->template()->initialize();
    }

    /**
     * @return string[]
     */
    public function modelAliases()
    {
        return array_map(function (ModelConfigurationInterface $model) {
            return $model->getAlias();
        }, $this->getModels());
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
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function registerModel($class, Closure $callback = null)
    {
        $this->register($model = new ModelConfiguration($this->template, $class));

        if (is_callable($callback)) {
            call_user_func($callback, $model);
        }

        return $this;
    }

    /**
     * @param string $class
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

        return array_get($this->models, $class);
    }

    /**
     * @return ModelConfigurationInterface[]
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
        return array_key_exists($class, $this->models);
    }

    /**
     * @param string             $class
     * @param ModelConfigurationInterface $model
     */
    public function setModel($class, ModelConfigurationInterface $model)
    {
        $this->models[$class] = $model;
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
        return app(AdminController::class)->renderContent($content, $title);
    }
}

<?php

namespace SleepingOwl\Admin;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\NavigationInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Http\Controllers\AdminController;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Model\ModelConfigurationFactory;
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
     * @var NavigationInterface
     */
    protected $navigation;

    /**
     * @var AdminController
     */
    protected $controller;

    /**
     * @var ModelConfigurationFactory
     */
    protected $factory;

    /**
     * Admin constructor.
     *
     * @param NavigationInterface $navigation
     * @param AdminController $controller
     * @param ModelConfigurationFactory $factory
     * @param TemplateInterface $template
     */
    public function __construct(NavigationInterface $navigation,
                                AdminController $controller,
                                ModelConfigurationFactory $factory,
                                TemplateInterface $template)
    {
        $this->navigation = $navigation;
        $this->controller = $controller;
        $this->factory = $factory;
        $this->template = $template;
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
        $model = $this->factory->make(ModelConfiguration::class, $class);

        $this->register($model);

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
     * @return NavigationInterface
     */
    public function getNavigation()
    {
        return $this->navigation;
    }

    /**
     * @param string|Renderable $content
     * @param string|null       $title
     *
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function view($content, $title = null)
    {
        return $this->controller->renderContent($content, $title);
    }
}

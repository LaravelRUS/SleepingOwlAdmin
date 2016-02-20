<?php

namespace SleepingOwl\Admin;

use Closure;
use KodiCMS\Navigation\Navigation;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use KodiCMS\Navigation\Section as NavigationSection;
use SleepingOwl\Admin\Http\Controllers\AdminController;

class Admin
{
    /**
     * @var ModelConfiguration[]
     */
    protected $models = [];

    /**
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @var NavigationPage[]
     */
    protected $menuItems = [];

    /**
     * @return string[]
     */
    public function modelAliases()
    {
        return array_map(function (ModelConfiguration $model) {
            return $model->getAlias();
        }, $this->getModels());
    }

    /**
     * @param string $class
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function registerModel($class, Closure $callback = null)
    {
        $model = new ModelConfiguration($class);
        $this->setModel($class, $model);
        if (is_callable($callback)) {
            call_user_func($callback, $model);
        }

        return $this;
    }

    /**
     * @param string $class
     * @return ModelConfiguration
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
     * @return ModelConfiguration[]
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
     * @param ModelConfiguration $model
     */
    public function setModel($class, $model)
    {
        $this->models[$class] = $model;
    }

    /**
     * @return TemplateInterface
     */
    public function template()
    {
        if (is_null($this->template)) {
            $templateClass = config('sleeping_owl.template');
            $this->template = app($templateClass);
        }

        return $this->template;
    }

    /**
     * @param string $class
     *
     * @return NavigationPage
     */
    public function addMenuLink($class)
    {
        $model = $this->getModel($class);

        $page = new NavigationPage($model);
        $this->menuItems[] = $page;

        return $page;
    }

    /**
     * @param Navigation $navigation
     */
    public function buildMenu(Navigation $navigation)
    {
        $section = $navigation->addSection('SleepingOwl', null, 999);

        foreach ($this->menuItems as $item) {
            $section->addPage($item);
        }
    }

    /**
     * @param string|Renderable $content
     * @param string|null       $title
     *
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function view($content, $title = null)
    {
        $controller = app(AdminController::class);

        return $controller->render($title, $content);
    }
}

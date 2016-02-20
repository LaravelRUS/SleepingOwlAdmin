<?php

namespace SleepingOwl\Admin;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Facades\AdminNavigation;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\TemplateInterface;
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
     * @param string|null   $section
     *
     * @return NavigationPage
     */
    public function addMenuLink($class, $section = null)
    {
        $model = $this->getModel($class);
        $page  = new NavigationPage($model);

        if (is_null($section)) {
            $section = AdminNavigation::getRootSection();
        } else {
            $section = AdminNavigation::findSectionOrCreate($section);
        }

        $section->addPage($page);

        return $page;
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

        return $controller->renderContent($content, $title);
    }
}

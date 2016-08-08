<?php

namespace SleepingOwl\Admin\Contracts;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Navigation;
use SleepingOwl\Admin\Navigation\Page;

interface AdminInterface
{
    /**
     * @return string[]
     */
    public function modelAliases();

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return self
     */
    public function register(ModelConfigurationInterface $model);

    /**
     * @param string $class
     * @param Closure|null $callback
     *
     * @return self
     */
    public function registerModel($class, Closure $callback = null);

    /**
     * @param string $class
     * @return ModelConfigurationInterface
     */
    public function getModel($class);

    /**
     * @return ModelConfigurationInterface[]
     */
    public function getModels();

    /**
     * @param string $class
     *
     * @return bool
     */
    public function hasModel($class);

    /**
     * @param string $class
     * @param ModelConfigurationInterface $model
     */
    public function setModel($class, ModelConfigurationInterface $model);

    /**
     * @return TemplateInterface
     */
    public function template();

    /**
     * @param string $class
     * @param int $priority
     *
     * @return Page
     */
    public function addMenuPage($class = null, $priority = 100);

    /**
     * @return Navigation
     */
    public function getNavigation();

    /**
     * @param string|Renderable $content
     * @param string|null $title
     *
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function view($content, $title = null);
}

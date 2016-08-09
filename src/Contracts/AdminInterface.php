<?php

namespace SleepingOwl\Admin\Contracts;

use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;

interface AdminInterface extends Initializable
{
    /**
     * @return string[]
     */
    public function modelAliases();

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function register(ModelConfigurationInterface $model);

    /**
     * @param string $class
     * @param \Closure|null $callback
     *
     * @return $this
     */
    public function registerModel($class, \Closure $callback = null);

    /**
     * @param string $class
     *
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
     * @param string             $class
     * @param ModelConfigurationInterface $model
     */
    public function setModel($class, ModelConfigurationInterface $model);

    /**
     * @return \SleepingOwl\Admin\Contracts\Template\TemplateInterface
     */
    public function template();

    /**
     * @return NavigationInterface
     */
    public function navigation();

    /**
     * @return MetaInterface
     */
    public function meta();
}
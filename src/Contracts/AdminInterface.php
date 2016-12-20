<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Support\Collection;
use Baum\Extensions\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

interface AdminInterface extends Initializable
{
    /**
     * @return string[]|Collection
     */
    public function aliases();

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
     * @param string $alias
     *
     * @return ModelConfigurationInterface|null
     */
    public function getModel($alias);

    /**
     * @param string|Model $class
     *
     * @return ModelConfigurationInterface|null
     */
    public function getModelByClass($class);

    /**
     * @return ModelConfigurationInterface[]|Collection
     */
    public function getModels();

    /**
     * @param string $class
     *
     * @return bool
     */
    public function hasModel($class);

    /**
     * @param string $key
     * @param ModelConfigurationInterface $model
     */
    public function setModel($key, ModelConfigurationInterface $model);

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

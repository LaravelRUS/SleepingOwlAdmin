<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

interface AdminInterface extends Initializable
{
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
     * @param TemplateInterface $template
     */
    public function setTemplate(TemplateInterface $template);

    /**
     * @return TemplateInterface
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

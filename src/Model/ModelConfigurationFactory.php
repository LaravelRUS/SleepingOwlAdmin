<?php
namespace SleepingOwl\Admin\Model;

use Illuminate\Contracts\Container\Container;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;

class ModelConfigurationFactory
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * ModelConfigurationFactory constructor.
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * @param string $modelConfigurationClass
     * @param string $model
     * @return ModelConfigurationInterface
     */
    public function make($modelConfigurationClass, $model)
    {
        if (! class_exists($modelConfigurationClass)) {
            throw new \InvalidArgumentException("{[$modelConfigurationClass]} must exists");
        }

        $repository = $this->container->make(RepositoryInterface::class, ['class' => $model]);

        /** @var ModelConfigurationInterface $model */
        $model = $this->container->make($modelConfigurationClass, ['repository' => $repository]);

        return $model;
    }
}
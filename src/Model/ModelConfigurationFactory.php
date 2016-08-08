<?php

namespace SleepingOwl\Admin\Model;

use Illuminate\Contracts\Container\Container;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Factories\RepositoryFactory;

class ModelConfigurationFactory
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * @var RepositoryFactory
     */
    protected $repositoryFactory;

    /**
     * ModelConfigurationFactory constructor.
     * @param Container $container
     * @param RepositoryFactory $repositoryFactory
     */
    public function __construct(Container $container, RepositoryFactory $repositoryFactory)
    {
        $this->container = $container;
        $this->repositoryFactory = $repositoryFactory;
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

        $repository = $this->repositoryFactory->make($model);

        /** @var ModelConfigurationInterface $model */
        $model = $this->container->make($modelConfigurationClass, ['repository' => $repository]);

        return $model;
    }
}

<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Container\Container;
use SleepingOwl\Admin\Contracts\RepositoryInterface;

class RepositoryFactory
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * RepositoryFactory constructor.
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * @param string $repositoryClass
     * @param string $model
     * @return RepositoryInterface
     */
    public function make($model, $repositoryClass = RepositoryInterface::class)
    {
        return $this->container->make($repositoryClass, ['class' => $model]);
    }
}

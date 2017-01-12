<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Routing\Router;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Display\TableColumn;
use SleepingOwl\Admin\Traits\OrderableModel;

class Order extends TableColumn implements WithRoutesInterface
{
    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var string
     */
    protected $view = 'column.order';

    /**
     * Register routes.
     *
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.display.column.move-up';
        if (! $router->has($routeName)) {
            $router->post('{adminModel}/{adminModelId}/up', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\DisplayColumnController@orderUp',
            ]);
        }

        $routeName = 'admin.display.column.move-down';
        if (! $router->has($routeName)) {
            $router->post('{adminModel}/{adminModelId}/down', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\DisplayColumnController@orderDown',
            ]);
        }
    }

    public function __construct()
    {
        parent::__construct();
        $this->setHtmlAttribute('class', 'row-order');
    }

    /**
     * @return Model $model
     * @throws \Exception
     */
    public function getModel()
    {
        if (! in_array(OrderableModel::class, trait_uses_recursive($class = get_class($this->model)))) {
            throw new \Exception("Model [$class] should uses trait [SleepingOwl\\Admin\\Traits\\OrderableModel]");
        }

        return $this->model;
    }

    /**
     * Get order value from instance.
     * @return int
     */
    protected function getOrderValue()
    {
        return $this->getModel()->getOrderValue();
    }

    /**
     * Get models total count.
     * @return int
     */
    protected function totalCount()
    {
        return $this->getModelConfiguration()->getRepository()->getQuery()->count();
    }

    /**
     * Check if instance is movable up.
     * @return bool
     */
    protected function movableUp()
    {
        return $this->getOrderValue() > 0;
    }

    /**
     * Get instance move up url.
     * @return string
     */
    protected function moveUpUrl()
    {
        return route('admin.display.column.move-up', [
            $this->getModelConfiguration()->getAlias(),
            $this->getModel()->getKey(),
        ]);
    }

    /**
     * Check if instance is movable down.
     * @return bool
     */
    protected function movableDown()
    {
        return $this->getOrderValue() < $this->totalCount() - 1;
    }

    /**
     * Get instance move down url.
     * @return string
     */
    protected function moveDownUrl()
    {
        return route('admin.display.column.move-down', [
            $this->getModelConfiguration()->getAlias(),
            $this->getModel()->getKey(),
        ]);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'movableUp' => $this->movableUp(),
            'moveUpUrl' => $this->moveUpUrl(),
            'movableDown' => $this->movableDown(),
            'moveDownUrl' => $this->moveDownUrl(),
        ];
    }
}

<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Routing\Router;
use KodiCMS\Assets\Contracts\MetaInterface;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Display\TableColumn;
use SleepingOwl\Admin\Http\Controllers\OrderElementController;
use SleepingOwl\Admin\Traits\OrderableModel;

class Order extends TableColumn implements WithRoutesInterface
{
    /**
     * Register routes.
     *
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $router->post('{adminModel}/{adminModelId}/up')
            ->uses(OrderElementController::class.'@up')
            ->name('admin.model.move-up');

        $router->post('{adminModel}/{adminModelId}/down')
            ->uses(OrderElementController::class.'@down')
            ->name('admin.model.move-down');
    }

    public function __construct(TableHeaderColumnInterface $tableHeaderColumn,
                                AdminInterface $admin,
                                MetaInterface $meta)
    {
        parent::__construct(null, $tableHeaderColumn, $admin, $meta);
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
     * @return Route
     */
    protected function moveUpUrl()
    {
        return route('admin.model.move-up', [
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
     * @return Route
     */
    protected function moveDownUrl()
    {
        return route('admin.model.move-down', [
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

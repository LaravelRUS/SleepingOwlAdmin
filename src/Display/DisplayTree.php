<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Database\Eloquent\Collection;
use Route;
use Request;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Display\Extension\Tree;
use SleepingOwl\Admin\Repository\TreeRepository;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class DisplayTree extends Display implements WithRoutesInterface
{
    /**
     * @var Collection
     */
    protected $collection;

    public static function registerRoutes()
    {
        Route::post('{adminModel}/reorder', function (ModelConfigurationInterface $model) {
            $model->fireDisplay()->getRepository()->reorder(
                Request::input('data')
            );
        });
    }

    /**
     * @var string
     */
    protected $view = 'display.tree';

    /**
     * @var array
     */
    protected $parameters = [];

    /**
     * @var bool
     */
    protected $reorderable = true;

    /**
     * @var string
     */
    protected $value = 'title';

    /**
     * @var string
     */
    protected $parentField = 'parent_id';

    /**
     * @var string
     */
    protected $orderField = 'order';

    /**
     * @var string|null
     */
    protected $rootParentId = null;

    /**
     * @var string
     */
    protected $repositoryClass = TreeRepository::class;

    /**
     * @var TreeRepository
     */
    protected $repository;

    /**
     * @var Column\TreeControl
     */
    protected $controlColumn;

    public function __construct()
    {
        parent::__construct();

        $this->extend('tree', new Tree());
    }

    public function initialize()
    {
        parent::initialize();

        $this->getRepository()
             ->setParentField($this->getParentField())
             ->setOrderField($this->getOrderField())
             ->setRootParentId($this->getRootParentId());
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return string
     */
    public function getParentField()
    {
        return $this->parentField;
    }

    /**
     * @param string $parentField
     *
     * @return $this
     */
    public function setParentField($parentField)
    {
        $this->parentField = $parentField;

        return $this;
    }

    /**
     * @return string
     */
    public function getOrderField()
    {
        return $this->orderField;
    }

    /**
     * @param string $orderField
     *
     * @return $this
     */
    public function setOrderField($orderField)
    {
        $this->orderField = $orderField;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getRootParentId()
    {
        return $this->rootParentId;
    }

    /**
     * @param null|string $rootParentId
     *
     * @return $this
     */
    public function setRootParentId($rootParentId)
    {
        $this->rootParentId = $rootParentId;

        return $this;
    }

    /**
     * @return array
     */
    public function getParameters()
    {
        return $this->parameters;
    }

    /**
     * @param array $parameters
     *
     * @return $this
     */
    public function setParameters($parameters)
    {
        $this->parameters = $parameters;

        return $this;
    }

    /**
     * @param string $key
     * @param mixed  $value
     *
     * @return $this
     */
    public function setParameter($key, $value)
    {
        $this->parameters[$key] = $value;

        return $this;
    }

    /**
     * @return bool
     */
    public function isReorderable()
    {
        return $this->reorderable;
    }

    /**
     * @param bool $reorderable
     *
     * @return $this
     */
    public function setReorderable($reorderable)
    {
        $this->reorderable = (bool) $reorderable;

        return $this;
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view($this->getView(), $this->toArray());
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $model = $this->getModelConfiguration();

        return parent::toArray() + [
            'items'       => $this->getRepository()->getTree($this->getCollection()),
            'reorderable' => $this->isReorderable(),
            'url'         => $model->getDisplayUrl(),
            'value'       => $this->getValue(),
            'creatable'   => $model->isCreatable(),
            'createUrl'   => $model->getCreateUrl($this->getParameters() + Request::all()),
            'controls'    => [app('sleeping_owl.table.column')->treeControl()],
        ];
    }

    /**
     * @return ModelConfigurationInterface
     */
    protected function getModelConfiguration()
    {
        return app('sleeping_owl')->getModel($this->modelClass);
    }

    /**
     * @return Collection
     * @throws \Exception
     */
    public function getCollection()
    {
        if (! $this->isInitialized()) {
            throw new \Exception('Display is not initialized');
        }

        if (! is_null($this->collection)) {
            return $this->collection;
        }

        $query = $this->getRepository()->getQuery();

        $this->modifyQuery($query);

        return $query->get();
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder|Builder $query
     */
    protected function modifyQuery(\Illuminate\Database\Eloquent\Builder $query)
    {
        $this->extensions->each(function (DisplayExtensionInterface $extension) use ($query) {
            $extension->modifyQuery($query);
        });
    }
}

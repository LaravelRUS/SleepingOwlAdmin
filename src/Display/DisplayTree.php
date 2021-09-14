<?php

namespace SleepingOwl\Admin\Display;

use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Repositories\TreeRepositoryInterface;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Display\Extension\Columns;
use SleepingOwl\Admin\Display\Tree\OrderTreeType;
use SleepingOwl\Admin\Repositories\TreeRepository;
use SleepingOwl\Admin\Traits\CardControl;

/**
 * @method TreeRepositoryInterface getRepository()
 *
 * @property TreeRepositoryInterface $repository
 *
 * @method Columns getColumns()
 * @method $this setColumns(ColumnInterface|ColumnInterface[] $column)
 */
class DisplayTree extends Display implements WithRoutesInterface
{
    use CardControl;

    /**
     * @param  Router  $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.display.tree.reorder';
        if (! $router->has($routeName)) {
            $router->post('{adminModel}/reorder',
                ['as' => $routeName, 'uses' => 'SleepingOwl\Admin\Http\Controllers\DisplayController@treeReorder']);
        }
    }

    /**
     * @var int
     */
    protected $max_depth = 20;
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
     * @var string|callable
     */
    protected $value = 'title';

    /**
     * @var int
     */
    protected $collapsedLevel = 5;

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
     * @var Column\TreeControl
     */
    protected $controlColumn;

    /**
     * @var Collection
     */
    protected $collection;

    /**
     * @var string|null
     */
    protected $newEntryButtonText;

    /**
     * @var string
     */
    protected $treeType;

    /**
     * DisplayTree constructor.
     *
     * @param  string|null  $treeType
     */
    public function __construct($treeType = null)
    {
        parent::__construct();

        $this->treeType = $treeType;

        $this->setCardClass('card-tree');

        $this->extend('columns', new Columns());
    }

    public function initialize()
    {
        parent::initialize();

        $repository = $this->getRepository()
            ->setOrderField($this->getOrderField())
            ->setRootParentId($this->getRootParentId());

        if ($this->getParentField()) {
            $repository = $repository->setParentField($this->getParentField());
        }
        if (! is_null($this->treeType)) {
            $repository->setTreeType($this->treeType);
        }

        if ($this->treeType == OrderTreeType::class) {
            $this->setMaxDepth(1);
        }

        $this->setHtmlAttribute('data-max-depth', $this->getMaxDepth());
    }

    /**
     * @return string
     */
    public function getMaxDepth()
    {
        return $this->max_depth;
    }

    /**
     * @param  string|callable  $value
     * @return $this
     */
    public function setMaxDepth($value)
    {
        $this->max_depth = $value;

        return $this;
    }

    /**
     * @return callable|string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param  string|callable  $value
     * @return $this
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return int
     */
    public function getCollapsedLevel()
    {
        return $this->collapsedLevel;
    }

    /**
     * @param  int  $level
     * @return $this
     */
    public function setCollapsedLevel($level)
    {
        $this->collapsedLevel = $level;

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
     * @param  string  $parentField
     * @return $this
     */
    public function setParentField($parentField)
    {
        $this->parentField = $parentField;

        return $this;
    }

    /**
     * @return array|\Illuminate\Contracts\Translation\Translator|null|string
     */
    public function getNewEntryButtonText()
    {
        if (is_null($this->newEntryButtonText)) {
            $this->newEntryButtonText = trans('sleeping_owl::lang.button.new-entry');
        }

        return $this->newEntryButtonText;
    }

    /**
     * @param  string  $newEntryButtonText
     * @return $this
     */
    public function setNewEntryButtonText($newEntryButtonText)
    {
        $this->newEntryButtonText = $newEntryButtonText;

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
     * @param  string  $orderField
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
     * @param  null|string  $rootParentId
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
     * @param  array  $parameters
     * @return $this
     */
    public function setParameters($parameters)
    {
        $this->parameters = $parameters;

        return $this;
    }

    /**
     * @param  string  $key
     * @param  mixed  $value
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
     * @param  bool  $reorderable
     * @return $this
     */
    public function setReorderable($reorderable)
    {
        $this->reorderable = (bool) $reorderable;

        return $this;
    }

    /**
     * @return array
     *
     * @throws \Exception
     */
    public function toArray()
    {
        $model = $this->getModelConfiguration();
        $this->setHtmlAttribute('class', 'dd nestable');
        $parameters = $this->getParameters() + Request::all();

        return parent::toArray() + [
            'items' => $this->getRepository()->getTree($this->getCollection()),
            'reorderable' => $this->isReorderable(),
            'url' => $model->getDisplayUrl(),
            'value' => $this->getValue(),
            'collapsedLevel' => $this->getCollapsedLevel(),
            'creatable' => $model->isCreatable(),
            'createUrl' => $model->getCreateUrl($parameters),
            'controls' => [$this->getColumns()->getControlColumn()],
            'newEntryButtonText' => $this->getNewEntryButtonText(),
            'max_depth' => $this->getMaxDepth(),
            'card_class' => $this->getCardClass(),
            'parameters' => $parameters,
        ];
    }

    /**
     * @return Collection
     *
     * @throws \Exception
     */
    public function getCollection()
    {
        if (! $this->isInitialized()) {
            throw new Exception('Display is not initialized');
        }

        if (! is_null($this->collection)) {
            return $this->collection;
        }

        $query = $this->getRepository()->getQuery();

        $this->modifyQuery($query);

        if (method_exists($query, 'defaultOrder')) {
            return $query->defaultOrder()->get();
        }

        return $query->get();
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     */
    protected function modifyQuery(Builder $query)
    {
        $this->extensions->modifyQuery($query);
    }

    /**
     * @return \Illuminate\Foundation\Application|mixed
     *
     * @throws \Exception
     */
    protected function makeRepository()
    {
        $repository = parent::makeRepository();

        if (! ($repository instanceof TreeRepositoryInterface)) {
            throw new Exception('Repository class must be instanced of [TreeRepositoryInterface]');
        }

        return $repository;
    }
}

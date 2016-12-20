<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Database\Eloquent\Collection;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Repository\TreeRepository;
use SleepingOwl\Admin\Display\Column\TreeControl;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Contracts\TreeRepositoryInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;

/**
 * @method TreeRepositoryInterface getRepository()
 * @property TreeRepositoryInterface $repository
 */
class DisplayTree extends Display implements WithRoutesInterface
{
    /**
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.display.tree.reorder';
        if (! $router->has($routeName)) {
            $router->post('{adminModel}/reorder', ['as' => $routeName, function (ModelConfigurationInterface $model, \Illuminate\Http\Request $request) {
                $display = $model->fireDisplay();

                if ($display instanceof DisplayTabbed) {
                    $display->getTabs()->each(function ($tab) {
                        $content = $tab->getContent();
                        if ($content instanceof self) {
                            $content->getRepository()->reorder(
                                $request->input('data')
                            );
                        }
                    });
                } else {
                    $display->getRepository()->reorder(
                        $request->input('data')
                    );
                }
            }]);
        }
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
     * @var string|callable
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
     * @var Column\TreeControl
     */
    protected $controlColumn;

    /**
     * @var Collection
     */
    protected $collection;

    /**
     * @var TreeControl
     */
    protected $control;

    /**
     * @var Request
     */
    protected $request;

    /**
     * DisplayTree constructor.
     *
     * @param AdminInterface $admin
     * @param TreeRepository $repository
     * @param TreeControl $control
     * @param Request $request
     */
    public function __construct(AdminInterface $admin, TreeRepository $repository, TreeControl $control, Request $request)
    {
        $this->control = $control;

        parent::__construct($admin, $repository);

        // TODO: move tree building to extension
        // $this->extend('tree', new Tree());
        $this->request = $request;
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
     * @param string|callable $value
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
        return $this->template->view($this->getView(), $this->toArray());
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $model = $this->getModelConfiguration();
        $items = $this->getRepository()->getTree($this->getCollection());

        return parent::toArray() + [
            'items' => $items,
            'reorderable' => $this->isReorderable(),
            'url' => $model->getDisplayUrl(),
            'value' => $this->getValue(),
            'creatable' => $model->isCreatable(),
            'createUrl' => $model->getCreateUrl($this->getParameters() + $this->request->all()),
            'controls' => [$this->control],
        ];
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

        if (method_exists($query, 'defaultOrder')) {
            return $query->defaultOrder()->get();
        }

        return $query->get();
    }

    /**
     * {@inheritdoc}
     */
    public function setModelConfiguration(ModelConfigurationInterface $model)
    {
        parent::setModelConfiguration($model);
        $this->control->setModelConfiguration($model);

        return $this;
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

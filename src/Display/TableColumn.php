<?php

namespace SleepingOwl\Admin\Display;

use SleepingOwl\Admin\Traits\Assets;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Traits\Renderable;
use Illuminate\Database\Eloquent\Builder;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Display\Column\OrderByClause;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

abstract class TableColumn implements ColumnInterface
{
    use HtmlAttributes, Assets, Renderable;

    /**
     * @var \Closure
     */
    protected $searchCallback = null;

    /**
     * @var \Closure
     */
    protected $orderCallback = null;

    /**
     * @var \Closure
     */
    protected $filterCallback = null;

    /**
     * @var null
     */
    protected $columMetaClass = null;
    /**
     * Column header.
     *
     * @var TableHeaderColumnInterface
     */
    protected $header;

    /**
     * Model instance currently rendering.
     *
     * @var Model
     */
    protected $model;

    /**
     * Column appendant.
     *
     * @var ColumnInterface
     */
    protected $append;

    /**
     * Column width.
     *
     * @var string
     */
    protected $width = null;

    /**
     * @var OrderByClauseInterface
     */
    protected $orderByClause;

    /**
     * @var bool
     */
    protected $visible = true;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * TableColumn constructor.
     *
     * @param string|null $label
     */
    public function __construct($label = null)
    {
        $this->header = app(TableHeaderColumnInterface::class);

        if (! is_null($label)) {
            $this->setLabel($label);
        }

        $this->initializePackage();
    }

    /**
     * Initialize column.
     */
    public function initialize()
    {
        $this->includePackage();
    }

    /**
     * @param $columnMetaClass
     * @return $this
     */
    public function setMetaData($columnMetaClass)
    {
        $this->columMetaClass = $columnMetaClass;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getMetaData()
    {
        return $this->columMetaClass
            ? app()->make($this->columMetaClass)
            : false;
    }

    /**
     * @param \Closure $callable
     * @return $this
     */
    public function setOrderCallback(\Closure $callable)
    {
        $this->orderCallback = $callable;

        return $this->setOrderable($callable);
    }

    /**
     * @param \Closure $callable
     * @return $this
     */
    public function setSearchCallback(\Closure $callable)
    {
        $this->searchCallback = $callable;

        return $this;
    }

    /**
     * @param \Closure $callable
     * @return $this
     */
    public function setFilterCallback(\Closure $callable)
    {
        $this->filterCallback = $callable;

        return $this;
    }

    /**
     * @return \Closure
     */
    public function getOrderCallback()
    {
        return $this->orderCallback;
    }

    /**
     * @return \Closure
     */
    public function getSearchCallback()
    {
        return $this->searchCallback;
    }

    /**
     * @return \Closure
     */
    public function getFilterCallback()
    {
        return $this->filterCallback;
    }

    /**
     * @return TableHeaderColumnInterface
     */
    public function getHeader()
    {
        return $this->header;
    }

    /**
     * @return int|string
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param int|string $width
     *
     * @return $this
     */
    public function setWidth($width)
    {
        if (is_int($width)) {
            $width = $width.'px';
        }

        $this->width = $width;

        return $this;
    }

    /**
     * @param $isSearchable
     *
     * @return TableColumn
     */
    public function setSearchable($isSearchable)
    {
        $this->isSearchable = $isSearchable;

        return $this;
    }

    /**
     * @param bool $visible
     * @return $this
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;

        return $this;
    }

    /**
     * @return ColumnInterface
     */
    public function getAppends()
    {
        return $this->append;
    }

    /**
     * @param ColumnInterface $append
     *
     * @return $this
     */
    public function append(ColumnInterface $append)
    {
        $this->append = $append;

        return $this;
    }

    /**
     * @return Model $model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;
        $append = $this->getAppends();

        if ($append instanceof WithModelInterface) {
            $append->setModel($model);
        }

        return $this;
    }

    /**
     * Set column header label.
     *
     * @param string $title
     *
     * @return $this
     */
    public function setLabel($title)
    {
        $this->getHeader()->setTitle($title);

        return $this;
    }

    /**
     * @param OrderByClauseInterface|bool|string|\Closure $orderable
     * @deprecated
     * @return $this
     */
    public function setOrderable($orderable)
    {
        if ($orderable instanceof \Closure || is_string($orderable)) {
            $orderable = new OrderByClause($orderable);
        }

        if ($orderable !== false && ! $orderable instanceof OrderByClauseInterface) {
            throw new \InvalidArgumentException('Argument must be instance of SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface interface');
        }

        $this->orderByClause = $orderable;
        $this->getHeader()->setOrderable($this->isOrderable());

        return $this;
    }

    /**
     * @return OrderByClauseInterface
     */
    public function getOrderByClause()
    {
        return $this->orderByClause;
    }

    /**
     * Check if column is orderable.
     * @return bool
     */
    public function isOrderable()
    {
        return $this->orderByClause instanceof OrderByClauseInterface;
    }

    /**
     * Check if column is visible.
     * @return bool
     */
    public function isVisible()
    {
        return $this->visible;
    }

    /**
     * Check if column is Searchable.
     * @return bool
     */
    public function isSearchable()
    {
        return $this->isSearchable;
    }

    /**
     * @param Builder $query
     * @param string $direction
     * @deprecated
     * @return $this
     */
    public function orderBy(Builder $query, $direction)
    {
        if (! $this->isOrderable()) {
            throw new \InvalidArgumentException('Argument must be instance of SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface interface');
        }

        $this->orderByClause->modifyQuery($query, $direction);

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'attributes' => $this->htmlAttributesToString(),
            'model'      => $this->getModel(),
            'append'     => $this->getAppends(),
        ];
    }

    /**
     * Get related model configuration.
     * @return ModelConfigurationInterface
     */
    protected function getModelConfiguration()
    {
        return app('sleeping_owl')->getModel(
            $this->getModel()
        );
    }
}

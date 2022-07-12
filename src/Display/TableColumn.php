<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use KodiCMS\Assets\Exceptions\PackageException;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Display\Column\OrderByClause;
use SleepingOwl\Admin\Traits\Assets;
use SleepingOwl\Admin\Traits\Renderable;
use SleepingOwl\Admin\Traits\SmallDisplay;
use SleepingOwl\Admin\Traits\VisibleCondition;
use SleepingOwl\Admin\Traits\Visibled;

abstract class TableColumn implements ColumnInterface
{
    use HtmlAttributes, Assets, Renderable, VisibleCondition;
    use SmallDisplay, Visibled;

    /**
     * @var Closure|null
     */
    protected ?Closure $searchCallback = null;

    /**
     * @var Closure|null
     */
    protected ?Closure $orderCallback = null;

    /**
     * @var Closure|null
     */
    protected ?Closure $filterCallback = null;

    /**
     * @var null
     */
    protected $columMetaClass = null;
    /**
     * Column header.
     *
     * @var TableHeaderColumnInterface
     */
    protected mixed $header;

    /**
     * Model instance currently rendering.
     *
     * @var Model
     */
    protected Model $model;

    /**
     * Column appended.
     *
     * @var ColumnInterface|null
     */
    protected ?ColumnInterface $append = null;

    /**
     * Column width.
     *
     * @var string|null
     */
    protected ?string $width = null;

    /**
     * @var OrderByClauseInterface
     */
    protected OrderByClauseInterface $orderByClause;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * TableColumn constructor.
     *
     * @param string|null $label
     */
    public function __construct(string $label = null)
    {
        $this->header = app(TableHeaderColumnInterface::class);

        if (! is_null($label)) {
            $this->setLabel($label);
        }

        $this->initializePackage();
    }

    /**
     * Initialize column.
     * @throws PackageException
     */
    public function initialize()
    {
        $this->includePackage();
    }

    /**
     * @param $columnMetaClass
     * @return $this
     */
    public function setMetaData($columnMetaClass): TableColumn
    {
        $this->columMetaClass = $columnMetaClass;

        return $this;
    }

    /**
     * @return mixed
     * @throws BindingResolutionException
     */
    public function getMetaData(): mixed
    {
        return $this->columMetaClass
            ? app()->make($this->columMetaClass)
            : false;
    }

    /**
     * @param  Closure  $callable
     * @return $this
     */
    public function setOrderCallback(Closure $callable): TableColumn
    {
        $this->orderCallback = $callable;

        return $this->setOrderable($callable);
    }

    /**
     * @param  Closure  $callable
     * @return $this
     */
    public function setSearchCallback(Closure $callable): TableColumn
    {
        $this->searchCallback = $callable;

        return $this;
    }

    /**
     * @param  Closure  $callable
     * @return $this
     */
    public function setFilterCallback(Closure $callable): TableColumn
    {
        $this->filterCallback = $callable;

        return $this;
    }

    /**
     * @return Closure|null
     */
    public function getOrderCallback(): ?Closure
    {
        return $this->orderCallback;
    }

    /**
     * @return Closure|null
     */
    public function getSearchCallback(): ?Closure
    {
        return $this->searchCallback;
    }

    /**
     * @return Closure|null
     */
    public function getFilterCallback(): ?Closure
    {
        return $this->filterCallback;
    }

    /**
     * @return TableHeaderColumnInterface
     */
    public function getHeader(): TableHeaderColumnInterface
    {
        return $this->header;
    }

    /**
     * @return string|null
     */
    public function getWidth(): ?string
    {
        return $this->width;
    }

    /**
     * @param int|string $width
     * @return $this
     */
    public function setWidth(int|string $width): TableColumn
    {
        if (is_int($width)) {
            $width = $width.'px';
        }

        $this->width = $width;

        return $this;
    }

    /**
     * @param $isSearchable
     * @return TableColumn
     */
    public function setSearchable($isSearchable): TableColumn
    {
        $this->isSearchable = $isSearchable;

        return $this;
    }

    /**
     * @return ColumnInterface|null
     */
    public function getAppends(): ?ColumnInterface
    {
        return $this->append;
    }

    /**
     * @param  ColumnInterface  $append
     * @return $this
     */
    public function append(ColumnInterface $append): self
    {
        $this->append = $append;

        return $this;
    }

    /**
     * @return Model $model
     */
    public function getModel(): Model
    {
        return $this->model;
    }

    /**
     * @param  Model  $model
     * @return $this
     */
    public function setModel(Model $model): self
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
     * @return $this
     */
    public function setLabel(string $title): self
    {
        $this->getHeader()->setTitle($title);

        return $this;
    }

    /**
     * @param  OrderByClauseInterface|bool|string|Closure $clause
     * @return $this
     */
    public function setOrderable($orderable): self
    {
        if ($orderable instanceof Closure || is_string($orderable)) {
            $orderable = new OrderByClause($orderable);
        }

        if ($orderable !== false && ! $orderable instanceof OrderByClauseInterface) {
            throw new InvalidArgumentException('Argument must be instance of SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface interface');
        }

        $this->orderByClause = $orderable;
        $this->getHeader()->setOrderable($this->isOrderable());

        return $this;
    }

    /**
     * @return OrderByClauseInterface
     */
    public function getOrderByClause(): OrderByClauseInterface
    {
        return $this->orderByClause;
    }

    /**
     * Check if column is orderable.
     *
     * @return bool
     */
    public function isOrderable(): bool
    {
        return $this->orderByClause instanceof OrderByClauseInterface;
    }

    /**
     * Check if column is Searchable.
     *
     * @return bool
     */
    public function isSearchable(): bool
    {
        return $this->isSearchable;
    }

    /**
     * @param  Builder  $query
     * @param string $direction
     * @return $this
     *
     * @TODO Почему депрекейтед?
     * @deprecated
     */
    public function orderBy(Builder $query, $direction)
    {
        if (! $this->isOrderable()) {
            throw new InvalidArgumentException('Argument must be instance of SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface interface');
        }

        $this->orderByClause->modifyQuery($query, $direction);

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'attributes' => $this->htmlAttributesToString(),
            'model' => $this->getModel(),
            'append' => $this->getAppends(),
        ];
    }

    /**
     * Get related model configuration.
     *
     * @return ModelConfigurationInterface
     */
    protected function getModelConfiguration()
    {
        return app('sleeping_owl')->getModel(
            $this->getModel()
        );
    }
}

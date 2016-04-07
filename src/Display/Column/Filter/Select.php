<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\NamedColumnInterface;

class Select extends BaseColumnFilter
{
    /**
     * @var string
     */
    protected $view = 'select';

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var string
     */
    protected $display = 'title';

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var string
     */
    protected $placeholder;

    /**
     * @var string
     */
    protected $filterField = '';

    /**
     * @return Model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param Model|string $model
     *
     * @return $this
     * @throws \Exception
     */
    public function setModel($model)
    {
        if (is_string($model) and class_exists($model)) {
            $model = new $model;
        }

        if (! ($model instanceof Model)) {
            throw new \Exception('Model must be an instance of Illuminate\Database\Eloquent\Model');
        }

        $this->model = $model;

        return $this;
    }

    /**
     * @return string
     */
    public function getFilterField()
    {
        return $this->filterField;
    }

    /**
     * @param string $filterField
     *
     * @return $this
     */
    public function setFilterField($filterField)
    {
        $this->filterField = $filterField;

        return $this;
    }

    /**
     * @return string
     */
    public function getDisplay()
    {
        return $this->display;
    }

    /**
     * @param string $display
     *
     * @return $this
     */
    public function setDisplay($display)
    {
        $this->display = $display;

        return $this;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        if (! is_null($this->getModel()) and ! is_null($this->getDisplay())) {
            $this->loadOptions();
        }

        $options = $this->options;
        asort($options);

        return $options;
    }

    /**
     * @param array $options
     *
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlaceholder()
    {
        return $this->placeholder;
    }

    /**
     * @param string $placeholder
     *
     * @return $this
     */
    public function setPlaceholder($placeholder)
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'options'     => $this->getOptions(),
            'placeholder' => $this->getPlaceholder(),
        ];
    }

    /**
     * @param RepositoryInterface  $repository
     * @param NamedColumnInterface $column
     * @param Builder              $query
     * @param string               $search
     * @param array|string         $fullSearch
     *
     * @return void
     */
    public function apply(
        RepositoryInterface $repository,
        NamedColumnInterface $column,
        Builder $query,
        $search,
        $fullSearch
    ) {
        if ($search === '') {
            return;
        }

        if ($this->getFilterField()) {
            $query->where($this->getFilterField(), '=', $search);

            return;
        }

        $name = $column->getName();
        if ($repository->hasColumn($name)) {
            $this->buildQuery($query, $name, $search);
        } elseif (strpos($name, '.') !== false) {
            $parts = explode('.', $name);
            $fieldName = array_pop($parts);
            $relationName = implode('.', $parts);
            $query->whereHas($relationName, function ($q) use ($search, $fieldName) {
                $this->buildQuery($q, $fieldName, $search);
            });
        }
    }

    protected function loadOptions()
    {
        $repository = app(RepositoryInterface::class, [$this->getModel()]);

        $key = $repository->getModel()->getKeyName();
        $options = $repository->getQuery()->get()->lists($this->getDisplay(), $key);

        if ($options instanceof Collection) {
            $options = $options->all();
        }

        $options = array_unique($options);
        $this->setOptions($options);
    }
}

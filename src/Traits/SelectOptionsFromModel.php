<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\Form\Element\SelectException;

trait SelectOptionsFromModel
{
    /**
     * @var Model
     */
    protected $modelForOptions;

    /**
     * @var string
     */
    protected $display = 'title';

    /**
     * @var string|null
     */
    protected $foreignKey = null;

    /**
     * @var array
     */
    protected $fetchColumns = [];

    /**
     * @var \Closure|object callable
     */
    protected $loadOptionsQueryPreparer;

    /**
     * @var bool
     */
    protected $isEmptyRelation = false;

    /**
     * @return Model
     */
    public function getModelForOptions()
    {
        return $this->modelForOptions;
    }

    /**
     * @param @param string|Model $modelForOptions
     *
     * @return $this
     * @throws SelectException
     */
    public function setModelForOptions($modelForOptions)
    {
        if (is_string($modelForOptions)) {
            $modelForOptions = app($modelForOptions);
        }

        if (! ($modelForOptions instanceof Model)) {
            throw new SelectException('Class must be instanced of Illuminate\Database\Eloquent\Model');
        }

        $this->modelForOptions = $modelForOptions;

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
     * Set Only fetch columns.
     *
     * If use {@link Select#setModelForOptions($model)}, on fetch
     * data from the $model table, only specified columns has be
     * feched.
     *
     * Examples: <code>setFetchColumns('title')</code> or
     * <code>setFetchColumns(['title'])</code> or
     * <code>setFetchColumns('title', 'position')</code> or
     * <code>setFetchColumns(['title', 'position'])</code>.
     *
     * @param string|array $columns
     * @return $this
     */
    public function setFetchColumns($columns)
    {
        if (! is_array($columns)) {
            $columns = func_get_args();
        }

        $this->fetchColumns = $columns;

        return $this;
    }

    /**
     * Get the fetch columns.
     *
     * @return array
     */
    public function getFetchColumns()
    {
        return $this->fetchColumns;
    }

    /**
     * Set Callback for prepare load options Query.
     *
     * Example:
     * <code>
     * <?php
     * AdminFormElement::select('column', 'Label')
     *     ->modelForOptions(MyModel::class)
     *     ->setLoadOptionsQueryPreparer(function($item, QueryBuilder $query) {
     *         return $query
     *             ->where('column', 'value')
     *             ->were('owner_id', Auth::user()->id)
     *     });
     * ?>
     * </code>
     *
     * @param callable $callback The Callback with $item and $options args.
     * @return $this
     */
    public function setLoadOptionsQueryPreparer($callback)
    {
        $this->loadOptionsQueryPreparer = $callback;

        return $this;
    }

    /**
     * Get Callback for prepare load options Query.
     * @return callable
     */
    public function getLoadOptionsQueryPreparer()
    {
        return $this->loadOptionsQueryPreparer;
    }

    /**
     * @param null|string $foreignKey
     *
     * @return $this
     */
    public function setForeignKey($foreignKey)
    {
        $this->foreignKey = $foreignKey;

        return $this;
    }

    /**
     * @return $this
     */
    public function onlyEmptyRelation()
    {
        $this->isEmptyRelation = true;

        return $this;
    }

    /**
     * @return bool
     */
    public function isEmptyRelation()
    {
        return $this->isEmptyRelation;
    }

    /**
     * @return array
     */
    protected function loadOptions()
    {
        $repository = app(RepositoryInterface::class, [$this->getModelForOptions()]);

        $key = $repository->getModel()->getKeyName();

        $options = $repository->getQuery();

        if ($this->isEmptyRelation() and ! is_null($foreignKey = $this->getForeignKey())) {
            $options->where($foreignKey, 0)->orWhereNull($foreignKey);
        }

        if (count($this->getFetchColumns()) > 0) {
            $options->select(
                array_merge([$key], $this->getFetchColumns())
            );
        }

        // call the pre load options query preparer if has be set
        if (! is_null($preparer = $this->getLoadOptionsQueryPreparer())) {
            $options = $preparer($this, $options);
        }

        $options = $options->get();

        if (is_callable($makeDisplay = $this->getDisplay())) {
            // make dynamic display text
            if ($options instanceof Collection) {
                $options = $options->all();
            }

            // iterate for all options and redefine it as
            // list of KEY and TEXT pair
            $options = array_map(function ($opt) use ($key, $makeDisplay) {
                // get the KEY and make the display text
                return [data_get($opt, $key), $makeDisplay($opt)];
            }, $options);

            // take options as array with KEY => VALUE pair
            $options = array_pluck($options, 1, 0);
        } elseif ($options instanceof Collection) {
            // take options as array with KEY => VALUE pair
            $options = array_pluck($options->all(), $this->getDisplay(), $key);
        } else {
            // take options as array with KEY => VALUE pair
            $options = array_pluck($options, $this->getDisplay(), $key);
        }

        return $options;
    }
}

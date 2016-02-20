<?php

namespace SleepingOwl\Admin\FormItems;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\FormItemInterface;

class Columns extends BaseFormItem
{
    /**
     * @var Collection
     */
    protected $columns;

    public function __construct()
    {
        $this->columns = new Collection();
    }

    public function initialize()
    {
        parent::initialize();

        $this->applyCallbackToItems(function (FormItemInterface $item) {
            $item->initialize();
        });
    }

    /**
     * @return array
     */
    public function getColumns()
    {
        return $this->columns;
    }

    /**
     * @param Collection $columns
     *
     * @return $this
     */
    public function setColumns(Collection $columns)
    {
        $this->columns = collect($columns);

        return $this;
    }

    public function addColumn(Closure $callback)
    {
        $this->columns->push(
            new Collection($callback())
        );

        return $this;
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        parent::setModel($model);

        $this->applyCallbackToItems(function (FormItemInterface $item) use ($model) {
            $item->setModel($model);
        });

        return $this;
    }

    /**
     * @return array
     */
    public function getParams()
    {
        return parent::getParams() + [
            'columns' => $this->getColumns(),
        ];
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        $rules = parent::getValidationRules();
        foreach ($this->getColumns() as $columnItems) {
            foreach ($columnItems as $item) {
                if ($item instanceof FormItemInterface) {
                    $rules += $item->getValidationRules();
                }
            }
        }

        return $rules;
    }

    public function save()
    {
        parent::save();

        $this->applyCallbackToItems(function (FormItemInterface $item) {
            $item->save();
        });
    }

    /**
     * @param Closure $callback
     */
    protected function applyCallbackToItems(Closure $callback)
    {
        foreach ($this->getColumns() as $columnItems) {
            foreach ($columnItems as $item) {
                if ($item instanceof FormItemInterface) {
                    call_user_func($callback, $item);
                }
            }
        }
    }
}

<?php

namespace SleepingOwl\Admin\Form\Columns;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface;
use SleepingOwl\Admin\Form\FormElements;

class Columns extends FormElements implements ColumnInterface
{
    use HtmlAttributes;

    /**
     * @var Collection|ColumnInterface
     */
    protected $columns;

    /**
     * @var int
     */
    protected $maxWidth = 12;

    /**
     * Columns constructor.
     *
     * @param array $columns
     */
    public function __construct(array $columns = [])
    {
        $this->setColumns($columns);
        parent::__construct();
    }

    /**
     * @return Collection|ColumnInterface
     */
    public function getColumns()
    {
        return $this->columns;
    }

    /**
     * @param array|ColumnInterface[] $columns
     *
     * @return $this
     */
    public function setColumns(array $columns)
    {
        $this->columns = new Collection($columns);

        return $this;
    }

    /**
     * @param Closure|ColumnInterface $column
     *
     * @return $this
     * @throws \Exception
     */
    public function addColumn($column)
    {
        if (is_callable($column)) {
            $column = new Column($column());
        }

        if (! ($column instanceof ColumnInterface)) {
            throw new \Exception('Column should be instance of ColumnInterface');
        }

        $this->columns->push($column);

        return $this;
    }

    public function initialize()
    {
        $this->setHtmlAttribute('class', 'row');

        $count = $this->getColumns()->filter(function (ColumnInterface $column) {
            return $column->getWidth() === 0;
        })->count();

        $width = $this->maxWidth - $this->getColumns()->sum(function (ColumnInterface $column) {
            return $column->getWidth();
        });

        $this->getColumns()->each(function (ColumnInterface $column) use ($width,$count) {
            if (! $column->getWidth()) {
                $column->setWidth(floor($width / $count));
            }

            $column->initialize();
        });
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        parent::setModel($model);

        $this->getColumns()->each(function (ColumnInterface $column) use ($model) {
            $column->setModel($model);
        });

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'columns' => $this->getColumns(),
            'elements' => $this->getElements(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        $rules = parent::getValidationRules();

        $this->getColumns()->each(function (ColumnInterface $column) use (&$rules) {
            $rules += $column->getValidationRules();
        });

        return $rules;
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        $messages = parent::getValidationMessages();

        $this->getColumns()->each(function (ColumnInterface $column) use (&$messages) {
            $messages += $column->getValidationMessages();
        });

        return $messages;
    }

    /**
     * @return array
     */
    public function getValidationLabels()
    {
        $labels = parent::getValidationLabels();

        $this->getColumns()->each(function (ColumnInterface $column) use (&$labels) {
            $labels += $column->getValidationLabels();
        });

        return $labels;
    }

    public function save()
    {
        parent::save();

        $this->getColumns()->each(function (ColumnInterface $column) {
            $column->save();
        });
    }

    public function afterSave()
    {
        parent::afterSave();

        $this->getColumns()->each(function (ColumnInterface $column) {
            $column->afterSave();
        });
    }

    /**
     * @return int
     */
    public function getWidth()
    {
    }

    /**
     * @return string
     */
    public function getSize()
    {
    }

    /**
     * @param string $size
     *
     * @return $this
     */
    public function setSize($size)
    {
        $this->getColumns()->each(function (ColumnInterface $column) use ($size) {
            $column->setSize($size);
        });
    }
}

<?php

namespace SleepingOwl\Admin\Form\Columns;

use Exception;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Form\FormElementsCollection;

class Columns extends FormElements implements ColumnInterface
{
    use HtmlAttributes;

    /**
     * @var int
     */
    protected $maxWidth = 12;

    /**
     * @var string
     */
    protected $view = 'form.element.columns';

    /**
     * @param  array  $elements
     */
    public function __construct(array $elements = [])
    {
        $this->elements = new FormElementsCollection();
        parent::__construct($elements);
    }

    /**
     * @param  array  $columns
     * @return $this|\SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface|\SleepingOwl\Admin\Form\FormElements
     *
     * @throws \Exception
     */
    public function setElements(array $columns)
    {
        foreach ($columns as $column) {
            $this->addColumn($column);
        }

        return $this;
    }

    /**
     * @param $column
     * @param  null  $width
     * @return \SleepingOwl\Admin\Form\Columns\Columns
     *
     * @throws \Exception
     */
    public function addColumn($column, $width = null)
    {
        return $this->addElement($column, $width);
    }

    /**
     * @param  \SleepingOwl\Admin\Contracts\Form\FormElementInterface[]|\Closure|ColumnInterface  $element
     * @param  int|null  $width
     * @return $this
     *
     * @throws \Exception
     */
    public function addElement($element, $width = null)
    {
        if (is_callable($element)) {
            $element = new Column($element());
        } elseif (is_array($element)) {
            $element = new Column($element);
        }

        if (! ($element instanceof ColumnInterface)) {
            throw new Exception('Column should be instance of ColumnInterface');
        }

        $element->setWidth($width);

        parent::addElement($element);

        return $this;
    }

    public function initialize()
    {
        $this->setHtmlAttribute('class', 'row');

        $count = $this->getElements()->filter(function (ColumnInterface $column) {
            return ! $column->getWidth();
        })->count();

        $width = $this->maxWidth - $this->getElements()->sum(function (ColumnInterface $column) {
            return is_numeric($column->getWidth()) ? (int) $column->getWidth() : 0;
        });

        $this->getElements()->each(function (ColumnInterface $column) use ($width, $count) {
            if (! $column->getWidth()) {
                $column->setWidth(floor($width / $count));
            }
        });

        parent::initialize();
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'columns' => $this->getElements()->onlyVisible(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * @return void
     */
    public function getWidth()
    {
    }

    /**
     * @return void
     */
    public function getSize()
    {
    }

    /**
     * @param  string  $size
     * @return \SleepingOwl\Admin\Contracts\Form\Columns\ColumnInterface|void
     */
    public function setSize($size)
    {
        $this->getColumns()->each(function (ColumnInterface $column) use ($size) {
            $column->setSize($size);
        });
    }
}

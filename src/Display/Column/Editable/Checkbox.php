<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use SleepingOwl\Admin\Display\Column\NamedColumn;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class Checkbox extends NamedColumn implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.checkbox';

    /**
     * @var null|string
     */
    protected $checkedLabel;

    /**
     * @var null|string
     */
    protected $uncheckedLabel;

    /**
     * Checkbox constructor.
     *
     * @param             $name
     * @param string|null $checkedLabel
     * @param string|null $uncheckedLabel
     */
    public function __construct($name, $checkedLabel = null, $uncheckedLabel = null)
    {
        parent::__construct($name);

        $this->checkedLabel = $checkedLabel;
        $this->uncheckedLabel = $uncheckedLabel;
    }

    /**
     * @return null|string
     */
    public function getCheckedLabel()
    {
        if (is_null($label = $this->checkedLabel)) {
            $label = trans('sleeping_owl::lang.editable.checkbox.checked');
        }

        return $label;
    }

    /**
     * @param null|string $label
     *
     * @return $this
     */
    public function setCheckedLabel($label)
    {
        $this->checkedLabel = $label;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getUncheckedLabel()
    {
        if (is_null($label = $this->uncheckedLabel)) {
            $label = trans('sleeping_owl::lang.editable.checkbox.unchecked');
        }

        return $label;
    }

    /**
     * @param null|string $label
     *
     * @return $this
     */
    public function setUncheckedLabel($label)
    {
        $this->uncheckedLabel = $label;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'id'             => $this->getModel()->getKey(),
            'value'          => $this->getModelValue(),
            'isEditable'     => $this->getModelConfiguration()->isEditable($this->getModel()),
            'checkedLabel'   => $this->getCheckedLabel(),
            'uncheckedLabel' => $this->getUncheckedLabel(),
        ];
    }

    /**
     * Save form item.
     *
     * @param mixed $value
     */
    public function save($value)
    {
        if (is_array($value)) {
            $value = array_shift($value);
        }

        $this->getModel()->setAttribute($this->getName(), (bool) $value);
        $this->getModel()->save();
    }
}

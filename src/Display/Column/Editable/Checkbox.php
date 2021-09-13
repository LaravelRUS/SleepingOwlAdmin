<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Form\FormDefault;

class Checkbox extends EditableColumn implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.checkbox';

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @var null|string
     */
    protected $checkedLabel;

    /**
     * @var null|string
     */
    protected $uncheckedLabel;

    /**
     * @var string
     */
    protected $width = '70px';

    /**
     * Checkbox constructor.
     *
     * @param  string  $name
     * @param  string|null  $checkedLabel
     * @param  string|null  $uncheckedLabel
     * @param  string|null  $columnLabel
     */
    public function __construct($name, $columnLabel = null, $small = null, $uncheckedLabel = null, $checkedLabel = null)
    {
        parent::__construct($name, $columnLabel, $small);

        $this->checkedLabel = $checkedLabel;
        $this->uncheckedLabel = $uncheckedLabel;

        if ($checkedLabel) {
            $this->setLabel($checkedLabel);
        }
    }

    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        if (is_null($this->modifier)) {
            return $this->getModelValue() ? $this->getCheckedLabel() : $this->getUncheckedLabel();
        }

        return $this->modifier;
    }

    /**
     * @return null|string|array
     */
    public function getCheckedLabel()
    {
        if (is_null($label = $this->checkedLabel)) {
            $label = trans('sleeping_owl::lang.editable.checkbox.checked');
        }

        return $label;
    }

    /**
     * @param  null|string  $label
     * @return $this
     */
    public function setCheckedLabel($label)
    {
        $this->checkedLabel = $label;

        return $this;
    }

    /**
     * @return null|string|array
     */
    public function getUncheckedLabel()
    {
        if (is_null($label = $this->uncheckedLabel)) {
            $label = "<i class='fas fa-minus'></i>";
        }

        return $label;
    }

    /**
     * @param  null|string  $label
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
        return array_merge(parent::toArray(), [
            'checkedLabel' => $this->getCheckedLabel(),
            'uncheckedLabel' => $this->getUncheckedLabel(),
            'text' => $this->getModifierValue(),
        ]);
    }

    /**
     * @param  Request  $request
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     */
    public function save(Request $request)
    {
        $form = new FormDefault([
            new \SleepingOwl\Admin\Form\Element\Checkbox(
                $this->getName()
            ),
        ]);

        $model = $this->getModel();

        $array = [];
        Arr::set($array, $this->getName(), $request->input('value', null));

        $request->merge($array);

        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());

        $form->saveForm($request);
    }
}

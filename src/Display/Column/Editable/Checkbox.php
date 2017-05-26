<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use SleepingOwl\Admin\Form\FormDefault;
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
     * @var string
     */
    protected $url = null;

    /**
     * Checkbox constructor.
     *
     * @param string      $name
     * @param string|null $checkedLabel
     * @param string|null $uncheckedLabel
     * @param string|null $columnLabel
     */
    public function __construct($name, $checkedLabel = null, $uncheckedLabel = null, $columnLabel = null)
    {
        parent::__construct($name, $columnLabel);

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
     * @return string
     */
    public function getUrl()
    {
        if (! $this->url) {
            return request()->url();
        }

        return $this->url;
    }

    /**
     * @param $url
     * @return string
     */
    public function setUrl($url)
    {
        $this->url = $url;

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
                'url'            => $this->getUrl(),
            ];
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
    {
        $form = new FormDefault([
            new \SleepingOwl\Admin\Form\Element\Checkbox(
                $this->getName()
            ),
        ]);

        $model = $this->getModel();

        $request->offsetSet($this->getName(), (bool) $request->input('value.0', false));

        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());

        $form->saveForm($request);
    }
}

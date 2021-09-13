<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Form\FormDefault;

class Number extends EditableColumn implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.number';

    /**
     * @var int
     */
    protected $min;

    /**
     * @var int
     */
    protected $max;

    /**
     * @var int
     */
    protected $step;

    /**
     * Number constructor.
     *
     * @param  $name
     * @param  $label
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label, $small);
    }

    /**
     * @param  int  $min
     * @return $this
     */
    public function setMin($min)
    {
        $this->min = $min;

        return $this;
    }

    /**
     * @param  int  $max
     * @return $this
     */
    public function setMax($max)
    {
        $this->max = $max;

        return $this;
    }

    /**
     * @param  int  $step
     * @return $this
     */
    public function setStep($step)
    {
        $this->step = $step;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'min' => $this->min,
            'max' => $this->max,
            'step' => $this->step,
        ];
    }

    /**
     * @param  Request  $request
     * @return void
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     */
    public function save(Request $request)
    {
        $form = new FormDefault([
            new \SleepingOwl\Admin\Form\Element\Number(
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

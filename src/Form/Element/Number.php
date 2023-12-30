<?php

namespace SleepingOwl\Admin\Form\Element;

class Number extends NamedFormElement
{
    /**
     * @var float
     */
    protected $min;

    /**
     * @var float
     */
    protected $max;

    /**
     * @var float
     */
    protected $step;

    /**
     * @var string
     */
    protected $view = 'form.element.number';

    /**
     * @return float
     */
    public function getMin()
    {
        return $this->min;
    }

    /**
     * @param  float  $min
     * @return $this
     */
    public function setMin($min)
    {
        $this->min = (float) $min;

        return $this;
    }

    /**
     * @return float
     */
    public function getMax()
    {
        return $this->max;
    }

    /**
     * @param  float  $max
     * @return $this
     */
    public function setMax($max)
    {
        $this->max = (float) $max;

        return $this;
    }

    /**
     * @return float
     */
    public function getStep()
    {
        return $this->step;
    }

    /**
     * @param  float  $step
     * @return $this
     */
    public function setStep($step)
    {
        $this->step = (float) $step;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'class' => 'form-control',
            'type' => 'number',
            'max' => $this->getMax(),
            'min' => $this->getMin(),
            'step' => $this->getStep(),
        ]);

        return parent::toArray() + [
            'min' => $this->getMin(),
            'max' => $this->getMax(),
            'step' => $this->getStep(),
        ];
    }

    /**
     * @param  mixed  $value
     * @return null|int
     */
    public function prepareValue($value)
    {
        if ($value == '') {
            return;
        }

        return parent::prepareValue(
            $value
        );
    }
}

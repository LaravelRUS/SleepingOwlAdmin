<?php

namespace SleepingOwl\Admin\Form\Element;

class Number extends NamedFormElement
{
    /**
     * @var double
     */
    protected $min;

    /**
     * @var double
     */
    protected $max;

    /**
     * @var double
     */
    protected $step;

    /**
     * @var string
     */
    protected $view = 'form.element.number';

    /**
     * @return double
     */
    public function getMin()
    {
        return $this->min;
    }

    /**
     * @param double $min
     *
     * @return $this
     */
    public function setMin($min)
    {
        $this->min = (double) $min;

        return $this;
    }

    /**
     * @return double
     */
    public function getMax()
    {
        return $this->max;
    }

    /**
     * @param double $max
     *
     * @return $this
     */
    public function setMax($max)
    {
        $this->max = (double) $max;

        return $this;
    }

    /**
     * @return double
     */
    public function getStep()
    {
        return $this->step;
    }

    /**
     * @param double $step
     *
     * @return $this
     */
    public function setStep($step)
    {
        $this->step = (double) $step;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'class' => 'form-control',
            'type'  => 'number',
            'max'   => $this->getMax(),
            'min'   => $this->getMin(),
            'step'  => $this->getStep(),
        ]);

        return parent::toArray() + [
                'min'  => $this->getMin(),
                'max'  => $this->getMax(),
                'step' => $this->getStep(),
            ];
    }

    /**
     * @param mixed $value
     *
     * @return null|int
     */
    public function prepareValue($value)
    {
        if ($value == '') {
            return;
        }

        return parent::prepareValue(
            (int) $value
        );
    }
}

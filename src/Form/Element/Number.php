<?php

namespace SleepingOwl\Admin\Form\Element;

class Number extends NamedFormElement
{
    /**
     * @var string
     */
    protected $min;

    /**
     * @var string
     */
    protected $max;

    /**
     * @var string
     */
    protected $step;

    /**
     * @return string
     */
    public function getMin()
    {
        return $this->min;
    }

    /**
     * @param string $min
     *
     * @return $this
     */
    public function setMin($min)
    {
        $this->min = $min;

        return $this;
    }

    /**
     * @return string
     */
    public function getMax()
    {
        return $this->max;
    }

    /**
     * @param string $max
     *
     * @return $this
     */
    public function setMax($max)
    {
        $this->max = $max;

        return $this;
    }

    /**
     * @return string
     */
    public function getStep()
    {
        return $this->step;
    }

    /**
     * @param string $step
     *
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
            'min' => $this->getMin(),
            'max' => $this->getMax(),
            'step' => $this->getStep(),
        ];
    }

    /**
     * @param mixed $value
     *
     * @return mixed
     */
    protected function prepareValue($value)
    {
    	if ($value == '') {
    		return;
    	}
    	
        return $value;
    }
}

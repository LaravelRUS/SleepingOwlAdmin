<?php

namespace SleepingOwl\Admin\Display\Column;

class Text extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.text';

    /**
     * @var \Closure|mixed
     */
    protected $modifier = null;

    /**
     * @var bool
     */
    protected $isSearchable = true;

    /**
     * @return \Closure|mixed
     */
    public function getModifier()
    {
        return $this->modifier;
    }

    /**
     * @param \Closure|mixed $modifier
     *
     * @return $this
     */
    public function setModifier($modifier)
    {
        $this->modifier = $modifier;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $model_value = $this->getModelValue();
        if (is_callable($modifier = $this->getModifier())) {
            $model_value = $modifier($model_value, $this->getModel());
        }

        return parent::toArray() + [
            'value' => $model_value,
            'small' => $this->getModelSmallValue(),
        ];
    }
}

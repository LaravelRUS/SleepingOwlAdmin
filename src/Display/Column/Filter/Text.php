<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

class Text extends BaseColumnFilter
{
    /**
     * @var string
     */
    protected $view = 'column.filter.text';

    /**
     * @var string
     */
    protected $placeholder;

    /**
     * @var bool
     */
    protected $defaultValue = null;

    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', 'form-control column-filter');
        $this->setHtmlAttribute('data-type', 'text');
        $this->setHtmlAttribute('type', 'text');
        $this->setHtmlAttribute('placeholder', $this->getPlaceholder());
    }

    /**
     * @return mixed
     */
    public function getDefault()
    {
        return $this->defaultValue;
    }

    /**
     * @param  mixed  $value
     * @return $this
     */
    public function setDefault($value)
    {
        $this->defaultValue = $value;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlaceholder()
    {
        return $this->placeholder;
    }

    /**
     * @param  string  $placeholder
     * @return $this
     */
    public function setPlaceholder($placeholder)
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        if ($this->getDefault()) {
            $this->setHtmlAttribute('value', $this->getDefault());
        }

        return parent::toArray() + [
            'placeholder' => $this->getPlaceholder(),
        ];
    }
}

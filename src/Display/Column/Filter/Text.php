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

    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', 'form-control column-filter');
        $this->setHtmlAttribute('data-type', 'text');
        $this->setHtmlAttribute('type', 'text');
        $this->setHtmlAttribute('placeholder', $this->getPlaceholder());
    }

    /**
     * @return string
     */
    public function getPlaceholder()
    {
        return $this->placeholder;
    }

    /**
     * @param string $placeholder
     *
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
        return parent::toArray() + [
            'placeholder' => $this->getPlaceholder(),
        ];
    }
}

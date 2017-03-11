<?php

namespace SleepingOwl\Admin\Display\Column;

class Url extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.url';

    /**
     * @var array
     */
    protected $linkAttributes = [];

    /**
     * @return array
     */
    public function getLinkAttributes()
    {
        return $this->linkAttributes;
    }

    /**
     * @param array $linkAttributes
     *
     * @return $this
     */
    public function setLinkAttributes(array $linkAttributes)
    {
        $this->linkAttributes = $linkAttributes;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'linkAttributes' => $this->getLinkAttributes(),
            'value' => $this->getModelValue(),
        ];
    }
}

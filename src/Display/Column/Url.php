<?php

namespace SleepingOwl\Admin\Display\Column;

class Url extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.url';

    /**
     * @var bool
     */
    protected $isSearchable = true;

    /**
     * @var bool
     */
    protected $orderable = true;

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
                'value' => strip_tags($this->getModelValue()),
                'small' => strip_tags($this->getModelSmallValue()),
            ];
    }
}

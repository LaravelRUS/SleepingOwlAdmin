<?php

namespace SleepingOwl\Admin\Display\Column;

class Link extends NamedColumn
{
    /**
     * @var array
     */
    protected $linkAttributes = [];

    /**
     * @param null|string $name
     * @param null|string $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
        $this->setHtmlAttribute('class', 'row-link');
    }

    /**
     * Check if instance editable.
     *
     * @return bool
     */
    protected function isEditable()
    {
        return $this->getModelConfiguration()->isEditable($this->getModel());
    }

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
            'value'          => $this->getModelValue(),
            'link'           => $this->getModelConfiguration()->getEditUrl($this->getModel()->getKey()),
            'append'         => $this->getAppends(),
            'linkAttributes' => $this->getLinkAttributes(),
            'isEditable'     => $this->isEditable(),
        ];
    }
}

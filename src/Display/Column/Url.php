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
     * @var string|boolean
     */
    protected $icon = 'fa fa-arrow-circle-o-right';

    /**
     * @var string
     */
    protected $text = '';

    /**
     * @var boolean
     */
    protected $textStatic = false;

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
     * @return string|boolean
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param string|boolean $icon
     *
     * @return $this
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;

        return $this;
    }


    /**
     * @return string
     */
    public function getText()
    {
        if ($this->textStatic) {
            return $this->text;
        }

        return $this->getValueFromObject($this->getModel(), $this->text);
    }

    /**
     * @param string $text
     *
     * @return $this
     */
    public function setText($text, $textStatic = false)
    {
        $this->text = $text;
        $this->textStatic = $textStatic;

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
                'small' => $this->getModelSmallValue(),
                'icon' => $this->getIcon(),
                'text' => $this->getText(),
            ];
    }
}

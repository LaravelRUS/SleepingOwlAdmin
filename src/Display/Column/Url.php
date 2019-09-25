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
     * @var string|bool
     */
    protected $icon = 'fas fa-external-link-square-alt';

    /**
     * @var string
     * @var boolean
     */
    protected $text = '';
    protected $textString = false;

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
     * @return string|bool
     */
    public function getText()
    {
        if ($this->textString) {
            return $this->text;
        }

        return $this->getValueFromObject($this->getModel(), $this->text);
    }

    /**
     * @param string|bool $icon
     *
     * @return $this
     */
    public function setText($text, $textString = false)
    {
        $this->text = $text;
        $this->textString = $textString;

        return $this;
    }

    /**
     * @return string|bool
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param string|bool $icon
     *
     * @return $this
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'linkAttributes' => $this->getLinkAttributes(),
            'value' => htmlspecialchars($this->getModelValue()),
            'icon' => $this->getIcon(),
            'text' => $this->getText(),
        ];
    }
}

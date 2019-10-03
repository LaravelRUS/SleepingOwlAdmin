<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use SleepingOwl\Admin\Display\Column\NamedColumn;

class EditableColumn extends NamedColumn
{
    /**
     * @var string
     */
    protected $url = null;

    /**
     * @var string
     */
    protected $title = null;

    /**
     * @var string
     */
    protected $editableMode = 'popup';

    /**
     * @var mixed
     */
    protected $text = null;

    /**
     * Text constructor.
     *
     * @param             $name
     * @param             $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);

        $this->clearHtmlAttributes();

        $this->setHtmlAttributes([
            'class' => 'inline-editable',
        ]);
    }

    /**
     * @return mixed
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * @return mixed
     */
    public function getTextValue()
    {
        if (is_callable($this->text)) {
            return call_user_func($this->text, $this);
        }

        if (is_null($this->text)) {
            return $this->getModelValue();
        }

        return $this->text;
    }

    /**
     * @param mixed $text
     * @return $this
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        if (isset($this->title)) {
            return $this->title;
        }

        return $this->header->getTitle();
    }

    /**
     * @param bool $sortable
     *
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        if (! $this->url) {
            return request()->url();
        }

        return $this->url;
    }

    /**
     * @param $url
     * @return string
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return string
     */
    public function getEditableMode()
    {
        return $this->editableMode;
    }

    /**
     * @param $url
     * @return string
     */
    public function setEditableMode($mode)
    {
        if (isset($mode) && in_array($mode, ['inline', 'popup'])) {
            $this->editableMode = $mode;
        }

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
                'id' => $this->getModel()->getKey(),
                'value' => $this->getModelValue(),
                'isEditable' => $this->getModelConfiguration()->isEditable($this->getModel()),
                'url' => $this->getUrl(),
                'title' => $this->getTitle(),
                'mode' => $this->getEditableMode(),
                'text' => $this->getTextValue()
            ];
    }
}

<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Closure;
use SleepingOwl\Admin\Display\Column\NamedColumn;

class EditableColumn extends NamedColumn
{
    /**
     * @var bool
     */
    protected $readonlyEditable = false;

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
    protected $modifier = null;

    /**
     * Text constructor.
     *
     * @param  $name
     * @param  $label
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label, $small);

        $this->clearHtmlAttributes();
    }

    /**
     * @return mixed
     */
    public function getModifier()
    {
        return $this->modifier;
    }

    /**
     * @return mixed
     */
    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        if (is_null($this->modifier)) {
            return $this->getModelValue();
        }

        return $this->modifier;
    }

    /**
     * @param  mixed  $text
     * @return $this
     */
    public function setModifier($modifier)
    {
        $this->modifier = $modifier;

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
     * @param  bool  $sortable
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
            $return = request()->url();
            if (request()->getScheme() != rtrim(\URL::formatScheme(), ':/')) {
                $return = preg_replace('~^[^:]+://~isu', \URL::formatScheme(), $return);
            }

            return $return;
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
     * @return bool|callable
     */
    public function isReadonly()
    {

        // Add policy
        if ($this->getModelConfiguration()->isEditable($this->getModel())) {
            if (is_callable($this->readonlyEditable)) {
                return (bool) call_user_func($this->readonlyEditable, $this->getModel());
            }

            return (bool) $this->readonlyEditable;
        }

        return true;
    }

    /**
     * @param  Closure|bool  $readonlyEditable
     * @return $this
     */
    public function setReadonly($readonlyEditable)
    {
        $this->readonlyEditable = $readonlyEditable;

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
            'isReadonly' => $this->isReadonly(),
            'url' => $this->getUrl(),
            'title' => $this->getTitle(),
            'mode' => $this->getEditableMode(),
            'text' => $this->getModifierValue(),
        ];
    }
}

<?php

namespace SleepingOwl\Admin\Form\Element;

use SleepingOwl\Admin\Exceptions\WysiwygException;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygEditorInterface;

class Wysiwyg extends NamedFormElement
{
    /**
     * @var string|null
     */
    protected $editor;

    /**
     * @var string|null
     */
    protected $filteredFieldKey;

    /**
     * @var array
     */
    protected $parameters = [];

    /**
     * @var bool
     */
    protected $filterValue = true;

    /**
     * @var string
     */
    protected $view = 'form.element.wysiwyg';

    /**
     * @param string      $path
     * @param string|null $label
     * @param string|null $editor
     */
    public function __construct($path, $label = null, $editor = null)
    {
        parent::__construct($path, $label);

        if (is_null($editor)) {
            $editor = app('sleeping_owl.wysiwyg')->getDefaultEditorId();
        }

        $this->setEditor($editor);
    }

    public function initialize()
    {
        /** @var WysiwygEditorInterface $editor */
        $editor = app('sleeping_owl.wysiwyg')->getEditor($this->getEditor());

        if (is_null($editor)) {
            throw new WysiwygException("Wysiwyg editor [{$this->getEditor()}] is not defined.");
        }

        app('sleeping_owl.wysiwyg')->loadEditor($this->getEditor());

        $config = $editor->getConfig();
        $config->set($this->parameters);

        $this->parameters = (array) $config->all();
    }

    /**
     * @return $this
     */
    public function disableFilter()
    {
        $this->filterValue = false;

        return $this;
    }

    /**
     * @return bool
     */
    public function canFilterValue()
    {
        return $this->filterValue;
    }

    /**
     * @return null|string
     */
    public function getEditor()
    {
        return $this->editor;
    }

    /**
     * @param null|string $editor
     *
     * @return $this
     */
    public function setEditor($editor)
    {
        $this->editor = $editor;

        return $this;
    }

    /**
     * @param int|null $height
     *
     * @return $this
     */
    public function setHeight($height)
    {
        $this->parameters['height'] = (int) $height;

        return $this;
    }

    /**
     * @return array
     */
    public function getParameters()
    {
        return $this->parameters;
    }

    /**
     * @param array $parameters
     *
     * @return $this
     */
    public function setParameters(array $parameters)
    {
        $this->parameters = $parameters;

        return $this;
    }

    /**
     * @param string $field
     *
     * @return $this
     */
    public function setFilteredValueToField($field)
    {
        $this->filteredFieldKey = $field;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'parameters' => json_encode($this->getParameters()),
            'editor'     => $this->getEditor(),
        ];
    }

    /**
     * @param mixed  $value
     *
     * @return void
     */
    public function setModelAttribute($value)
    {
        if (! empty($this->filteredFieldKey)) {
            parent::setModelAttribute($value);

            $this->setModelAttributeKey($this->filteredFieldKey);
            parent::setModelAttribute(
                $this->filterValue($value)
            );
        } else {
            parent::setModelAttribute(
                $this->filterValue($value)
            );
        }
    }

    /**
     * @param string $value
     *
     * @return string
     */
    protected function filterValue($value)
    {
        if ($this->canFilterValue()) {
            return app('sleeping_owl.wysiwyg')->applyFilter($this->getEditor(), $value);
        }

        return $value;
    }
}

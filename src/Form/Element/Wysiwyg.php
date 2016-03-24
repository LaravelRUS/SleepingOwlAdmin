<?php

namespace SleepingOwl\Admin\Form\Element;

use WysiwygManager;

class Wysiwyg extends NamedFormElement
{
    /**
     * @var string|null
     */
    protected $editor;

    /**
     * @var array
     */
    protected $parameters = [
        'height' => 200,
    ];

    /**
     * @param string      $path
     * @param string|null $label
     * @param string|null $editor
     */
    public function __construct($path, $label = null, $editor = null)
    {
        parent::__construct($path, $label);

        if (is_null($editor)) {
            $editor = WysiwygManager::getDefaultEditorId();
        }

        $this->setEditor($editor);
    }

    public function initialize()
    {
        WysiwygManager::loadEditor($this->getEditor());
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
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'name'       => $this->getName(),
            'label'      => $this->getLabel(),
            'value'      => $this->getValue(),
            'parameters' => $this->getParameters(),
            'editor'     => $this->getEditor(),
        ];
    }

    /**
     * @param string $attribute
     * @param mixed  $value
     */
    protected function setValue($attribute, $value)
    {
        parent::setValue($attribute, WysiwygManager::applyFilter($this->getEditor(), $value));
    }
}

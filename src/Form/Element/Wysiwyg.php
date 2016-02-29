<?php

namespace SleepingOwl\Admin\Form\Element;

use WYSIWYG as WYSIWYGHelper;

class Wysiwyg extends NamedFormElement
{
    /**
     * @var string|null
     */
    protected $editor;

    /**
     * @var int|null
     */
    protected $height = 200;

    /**
     * @var bool
     */
    protected $filterHtml = false;

    /**
     * @var string
     */
    protected $allowedHtmlTags = '<b><i><p><ul><li><ol>';

    /**
     * @param string      $path
     * @param string|null $label
     * @param string|null $editor
     */
    public function __construct($path, $label = null, $editor = null)
    {
        parent::__construct($path, $label);

        if (is_null($editor)) {
            $editor = WYSIWYGHelper::getDefaultHTMLEditorId();
        }

        $this->setEditor($editor);
    }

    public function initialize()
    {
        WYSIWYGHelper::loadEditor($this->getEditor());
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
     */
    public function setEditor($editor)
    {
        $this->editor = $editor;
    }

    /**
     * @return int|null
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * @param int|null $height
     */
    public function setHeight($height)
    {
        $this->height = (int) $height;
    }

    /**
     * @return bool
     */
    public function isFilterHtml()
    {
        return $this->filterHtml;
    }

    /**
     * @param bool $filterHtml
     */
    public function setFilterHtml($filterHtml)
    {
        $this->filterHtml = (bool) $filterHtml;
    }

    /**
     * @return string
     */
    public function getAllowedHtmlTags()
    {
        return $this->allowedHtmlTags;
    }

    /**
     * @param string $allowedHtmlTags
     */
    public function setAllowedHtmlTags($allowedHtmlTags)
    {
        $this->allowedHtmlTags = $allowedHtmlTags;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'name'     => $this->getName(),
            'label'    => $this->getLabel(),
            'value'    => $this->getValue(),
            'height'     => $this->getHeight(),
            'editor'     => $this->getEditor(),
        ];
    }

    /**
     * @param string $attribute
     * @param mixed $value
     */
    protected function setValue($attribute, $value)
    {
        if ($this->isFilterHtml()) {
            // TODO: add filter html tags
        }

        parent::setValue($attribute, WYSIWYGHelper::applyFilter($this->getEditor(), $value));
    }
}

<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\ManagerInterface;
use SleepingOwl\Admin\Wysiwyg\Manager;

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
     * @var ManagerInterface|Manager
     */
    protected $wysiwyg;

    /**
     * @param string $path
     * @param string|null $label
     * @param string|null $editor
     * @param TemplateInterface $template
     * @param Package $package
     * @param Request $request
     * @param ManagerInterface $manager
     */
    public function __construct($path,
                                $label,
                                $editor,
                                TemplateInterface $template,
                                Package $package,
                                Request $request,
                                ManagerInterface $manager)
    {
        parent::__construct($path, $label, $template, $package, $request);
        $this->wysiwyg = $manager;

        if (is_null($editor)) {
            $editor = $this->wysiwyg->getDefaultEditorId();
        }

        $this->setEditor($editor);
    }

    public function initialize()
    {
        $editor = $this->wysiwyg->getEditor($this->getEditor());

        $this->wysiwyg->loadEditor($this->getEditor());

        $this->parameters = array_merge($editor->getConfig(), $this->parameters);
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
            'name'       => $this->getName(),
            'label'      => $this->getLabel(),
            'value'      => $this->getValue(),
            'parameters' => json_encode($this->getParameters()),
            'editor'     => $this->getEditor(),
        ];
    }

    /**
     * @param Model  $model
     * @param string $attribute
     * @param mixed  $value
     */
    protected function setValue(Model $model, $attribute, $value)
    {
        if ($this->filterValue) {
            $filteredValue = $this->wysiwyg->applyFilter($this->getEditor(), $value);
        } else {
            $filteredValue = $value;
        }

        if (! empty($this->filteredFieldKey)) {
            parent::setValue($model, $attribute, $value);
            parent::setValue($model, $this->filteredFieldKey, $filteredValue);
        } else {
            parent::setValue($model, $attribute, $filteredValue);
        }
    }
}

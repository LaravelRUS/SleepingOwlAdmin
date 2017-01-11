<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModel;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Validation\ValidationException;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Traits\VisibleCondition;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Form\FormElementsCollection;
use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Exceptions\Display\DisplayTabException;

class DisplayTab implements TabInterface, DisplayInterface, FormInterface
{
    use VisibleCondition, \SleepingOwl\Admin\Traits\Renderable;

    /**
     * @var string
     */
    protected $label;

    /**
     * @var bool
     */
    protected $active = false;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $icon;

    /**
     * @var Renderable
     */
    protected $content;

    /**
     * @var string
     */
    protected $view = 'display.tab';

    /**
     * @param Renderable $content
     * @param string|null $label
     * @param string|null $icon
     */
    public function __construct(Renderable $content, $label = null, $icon = null)
    {
        $this->content = $content;

        if (! is_null($label)) {
            $this->setLabel($label);
        }

        if (! is_null($icon)) {
            $this->setIcon($icon);
        }
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param string $label
     *
     * @return $this
     */
    public function setLabel($label)
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return bool
     */
    public function isActive()
    {
        return $this->active;
    }

    /**
     * @param bool $active
     *
     * @return $this
     */
    public function setActive($active = true)
    {
        $this->active = (bool) $active;

        return $this;
    }

    /**
     * @return string
     * @throws DisplayTabException
     */
    public function getName()
    {
        if (is_null($this->name) and is_null($this->getLabel())) {
            throw new DisplayTabException('You should set name or label');
        }

        return is_null($this->name)
            ? md5($this->getLabel())
            : $this->name;
    }

    /**
     * @param string $name
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param string $icon
     *
     * @return $this
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return Renderable
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @param string $class
     *
     * @return $this
     */
    public function setModelClass($class)
    {
        if (($content = $this->getContent()) instanceof DisplayInterface) {
            $content->setModelClass($class);
        }

        return $this;
    }

    /**
     * Initialize tab.
     *
     * @return $this
     */
    public function initialize()
    {
        if (($content = $this->getContent()) instanceof Initializable) {
            $content->initialize();
        }

        return $this;
    }

    /**
     * @param string $action
     *
     * @return $this
     */
    public function setAction($action)
    {
        if (($content = $this->getContent()) instanceof FormInterface) {
            $content->setAction($action);
        }

        return $this;
    }

    /**
     * @param int $id
     *
     * @return $this
     */
    public function setId($id)
    {
        if (($content = $this->getContent()) instanceof FormInterface) {
            $content->setId($id);
        }

        return $this;
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param ModelConfigurationInterface $model
     *
     * @throws ValidationException
     */
    public function validateForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $model = null)
    {
        if (($content = $this->getContent()) instanceof FormInterface) {
            $content->validateForm($request, $model);
        }
    }

    /**
     * Save model.
     *
     * @param \Illuminate\Http\Request $request
     * @param ModelConfigurationInterface $model
     *
     * @return void
     */
    public function saveForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $model = null)
    {
        if (($content = $this->getContent()) instanceof FormInterface) {
            $content->saveForm($request, $model);
        }
    }

    /**
     * Set currently rendered instance.
     *
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        if (($content = $this->getContent()) instanceof WithModel) {
            $content->setModel($model);
        }

        return $this;
    }

    /**
     * @return Model $model
     */
    public function getModel()
    {
        if (($content = $this->getContent()) instanceof WithModel) {
            return $content->getModel();
        }
    }

    /**
     * Get form item validation rules.
     * @return array
     */
    public function getValidationRules()
    {
        if (($content = $this->getContent()) instanceof Validable) {
            return $content->getValidationRules();
        }

        return [];
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        if (($content = $this->getContent()) instanceof Validable) {
            return $content->getValidationMessages();
        }

        return [];
    }

    /**
     * @return array
     */
    public function getValidationLabels()
    {
        if (($content = $this->getContent()) instanceof Validable) {
            return $content->getValidationLabels();
        }

        return [];
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
    {
        if (($content = $this->getContent()) instanceof FormElementInterface) {
            $content->save($request);
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function afterSave(\Illuminate\Http\Request $request)
    {
        if (($content = $this->getContent()) instanceof FormElementInterface) {
            $content->afterSave($request);
        }
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        if (($content = $this->getContent()) instanceof FormElementInterface) {
            return $content->getValue();
        }
    }

    /**
     * @return bool
     */
    public function isReadonly()
    {
        if (($content = $this->getContent()) instanceof FormElementInterface) {
            return $content->isReadonly();
        }

        return false;
    }

    /**
     * @param string $path
     *
     * @return FormElementInterface|null
     */
    public function getElement($path)
    {
        if (($content = $this->getContent()) instanceof ElementsInterface) {
            return $content->getElement($path);
        }
    }

    /**
     * @return FormElementsCollection
     */
    public function getElements()
    {
        if (($content = $this->getContent()) instanceof ElementsInterface) {
            return $content->getElements();
        }

        return new FormElementsCollection();
    }

    /**
     * @param array $elements
     *
     * @return $this
     */
    public function setElements(array $elements)
    {
        if (($content = $this->getContent()) instanceof ElementsInterface) {
            $content->setElements($elements);
        }

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'label' => $this->getLabel(),
            'active' => $this->isActive(),
            'name' => $this->getName(),
            'icon' => $this->getIcon(),
        ];
    }
}

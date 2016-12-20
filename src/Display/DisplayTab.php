<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Validator;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class DisplayTab implements TabInterface, DisplayInterface, FormInterface
{
    /**
     * @var string
     */
    protected $label = '';

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
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @var ModelConfigurationInterface
     */
    protected $modelConfiguration;

    /**
     * @param TemplateInterface $template
     * @param Renderable $content
     * @param string|null $label
     * @param string|null $icon
     */
    public function __construct(TemplateInterface $template, Renderable $content, $label = null, $icon = null)
    {
        $this->content = $content;
        $this->template = $template;

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
     */
    public function getName()
    {
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
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $model)
    {
        $this->modelConfiguration = $model;

        if (($content = $this->getContent()) instanceof DisplayInterface) {
            $content->setModelConfiguration($model);
        }

        return $this;
    }

    /**
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        return $this->modelConfiguration;
    }

    /**
     * Initialize tab.
     *
     * @return $this
     */
    public function initialize()
    {
        if ($this->getContent() instanceof Initializable) {
            $this->getContent()->initialize();
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
        if ($this->getContent() instanceof FormInterface) {
            $this->getContent()->setAction($action);
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
        if ($this->getContent() instanceof FormInterface) {
            $this->getContent()->setId($id);
        }

        return $this;
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param \Illuminate\Http\Request $request
     * @param \Illuminate\Contracts\Validation\Factory $validator
     *
     * @return Validator|null
     */
    public function validateForm(ModelConfigurationInterface $model, \Illuminate\Http\Request $request, \Illuminate\Contracts\Validation\Factory $validator)
    {
        if ($this->getContent() instanceof FormInterface) {
            return $this->getContent()->validateForm($model, $request, $validator);
        }
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param \Illuminate\Http\Request $request
     *
     * @return $this
     */
    public function saveForm(ModelConfigurationInterface $model, \Illuminate\Http\Request $request)
    {
        if ($this->getContent() instanceof FormInterface) {
            $this->getContent()->saveForm($model, $request);
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getView()
    {
        return $this->view;
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

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return $this->template->view($this->getView(), $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }

    /**
     * Set currently rendered instance.
     *
     * @param Model $model
     */
    public function setModel(Model $model)
    {
        if ($this->getContent() instanceof FormElementInterface) {
            $this->getContent()->setModel($model);
        }
    }

    /**
     * @return Model $model
     */
    public function getModel()
    {
        if ($this->getContent() instanceof FormElementInterface) {
            return $this->getContent()->getModel();
        }
    }

    /**
     * Get form item validation rules.
     * @return array
     */
    public function getValidationRules()
    {
        if ($this->getContent() instanceof FormElementInterface) {
            return $this->getContent()->getValidationRules();
        }

        return [];
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        if ($this->getContent() instanceof FormElementInterface) {
            return $this->getContent()->getValidationMessages();
        }

        return [];
    }

    /**
     * @return array
     */
    public function getValidationLabels()
    {
        if ($this->getContent() instanceof FormElementInterface) {
            return $this->getContent()->getValidationLabels();
        }

        return [];
    }

    /**
     * Save form item.
     *
     * @param \Illuminate\Http\Request $request
     */
    public function save(\Illuminate\Http\Request $request)
    {
        if ($this->getContent() instanceof FormElementInterface) {
            $this->getContent()->save($request);
        }
    }

    /**
     * Save form item.
     *
     * @param \Illuminate\Http\Request $request
     */
    public function afterSave(\Illuminate\Http\Request $request)
    {
        if ($this->getContent() instanceof FormElementInterface) {
            $this->getContent()->afterSave($request);
        }
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
     * @return Collection
     */
    public function getElements()
    {
        if ($content = $this->getContent() instanceof ElementsInterface) {
            return $content->getElements();
        }
    }

    /**
     * @param array $elements
     *
     * @return $this
     */
    public function setElements(array $elements)
    {
        if ($content = $this->getContent() instanceof ElementsInterface) {
            return $content->setElements($elements);
        }
    }
}

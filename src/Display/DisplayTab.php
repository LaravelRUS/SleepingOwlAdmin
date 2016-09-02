<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
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
     * @param string $class
     *
     * @return $this
     */
    public function setModelClass($class)
    {
        if ($this->getContent() instanceof DisplayInterface) {
            $this->getContent()->setModelClass($class);
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
     *
     * @return Validator|null
     */
    public function validateForm(ModelConfigurationInterface $model)
    {
        if ($this->getContent() instanceof FormInterface) {
            return $this->getContent()->validateForm($model);
        }
    }

    /**
     * Save model.
     *
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function saveForm(ModelConfigurationInterface $model)
    {
        if ($this->getContent() instanceof FormInterface) {
            $this->getContent()->saveForm($model);
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
        return app('sleeping_owl.template')->view($this->getView(), $this->toArray());
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
     */
    public function save()
    {
        if ($this->getContent() instanceof FormElementInterface) {
            $this->getContent()->save();
        }
    }

    /**
     * Save form item.
     */
    public function afterSave()
    {
        if ($this->getContent() instanceof FormElementInterface) {
            $this->getContent()->afterSave();
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

<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Contracts\Validation\Validator;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\DisplayInterface;

// TODO: починить указание активности таба
class DisplayTab implements DisplayInterface, FormInterface
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
     * @var DisplayInterface
     */
    protected $content;

    /**
     * @var string
     */
    protected $view = 'display.tab';

    /**
     * @param DisplayInterface $content
     */
    public function __construct(DisplayInterface $content)
    {
        $this->content = $content;
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
     * @return DisplayInterface|FormInterface
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
     * @param ModelConfiguration $model
     *
     * @return Validator|null
     */
    public function validate(ModelConfiguration $model)
    {
        if ($this->getContent() instanceof FormInterface) {
            return $this->getContent()->validate($model);
        }
    }

    /**
     * Save model.
     *
     * @param ModelConfiguration $model
     *
     * @return $this
     */
    public function save(ModelConfiguration $model)
    {
        if ($this->getContent() instanceof FormInterface) {
            $this->getContent()->save($model);
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
            'label'  => $this->getLabel(),
            'active' => $this->isActive(),
            'name'   => $this->getName(),
            'icon'   => $this->getIcon(),
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
}

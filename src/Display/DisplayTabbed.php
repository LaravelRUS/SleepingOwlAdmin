<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Contracts\Validation\Validator;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\DisplayInterface;

class DisplayTabbed implements DisplayInterface, FormInterface
{
    /**
     * @var DisplayTab[]
     */
    protected $tabs = [];

    /**
     * @var string
     */
    protected $view = 'display.tabbed';

    public function initialize()
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab instanceof Initializable) {
                $tab->initialize();
            }
        }
    }

    /**
     * @param string $class
     */
    public function setModelClass($class)
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab instanceof DisplayInterface) {
                $tab->setModelClass($class);
            }
        }
    }

    /**
     * @return DisplayTab[]
     */
    public function getTabs()
    {
        return $this->tabs;
    }

    /**
     * @param Closure|DisplayTab[] $tabs
     *
     * @return $this
     */
    public function setTabs($tabs)
    {
        if (is_callable($tabs)) {
            $tabs = call_user_func($tabs, $this);
        }

        if (is_array($tabs)) {
            $this->tabs = $tabs;
        }

        return $this;
    }

    /**
     * @param DisplayInterface $display
     * @param string           $label
     * @param bool|false       $active
     *
     * @return $this
     */
    public function appendTab(DisplayInterface $display, $label, $active = false)
    {
        $tab = app('sleeping_owl.display')->tab($display)->setLabel($label)->setActive($active);

        $this->tabs[] = $tab;

        return $tab;
    }

    /**
     * @param string $action
     */
    public function setAction($action)
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab instanceof FormInterface) {
                $tab->setAction($action);
            }
        }
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab instanceof FormInterface) {
                $tab->setId($id);
            }
        }
    }

    /**
     * @param ModelConfiguration $model
     *
     * @return Validator|null
     */
    public function validate(ModelConfiguration $model)
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab instanceof FormInterface) {
                $result = $tab->validate($model);
                if (! is_null($result)) {
                    return $result;
                }
            }
        }
    }

    /**
     * @param ModelConfiguration $model
     */
    public function save(ModelConfiguration $model)
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab instanceof FormInterface) {
                $tab->save($model);
            }
        }
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
            'tabs' => $this->getTabs(),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view(
            $this->getView(),
            $this->toArray()
        );
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}

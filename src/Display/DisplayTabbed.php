<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class DisplayTabbed implements DisplayInterface, FormInterface, FormElementInterface
{
    /**
     * @var DisplayTab[]|Collection
     */
    protected $tabs;

    /**
     * @var string
     */
    protected $view = 'display.tabbed';

    public function __construct()
    {
        $this->tabs = new Collection();
    }

    public function initialize()
    {
        $this->getTabs()->each(function ($tab) {
            if ($tab instanceof Initializable) {
                $tab->initialize();
            }
        });
    }

    /**
     * @param string $class
     */
    public function setModelClass($class)
    {
        $this->getTabs()->each(function ($tab) use($class) {
            if ($tab instanceof DisplayInterface) {
                $tab->setModelClass($class);
            }
        });
    }

    /**
     * @return DisplayTab[]|Collection
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
            foreach ($tabs as $tab) {
                $this->tabs->push($tab);
            }
        }

        return $this;
    }

    /**
     * @param Renderable $display
     * @param string $label
     * @param bool|false $active
     *
     * @return $this
     */
    public function appendTab(Renderable $display, $label, $active = false)
    {
        $tab = app('sleeping_owl.display')->tab($display)->setLabel($label)->setActive($active);

        $this->tabs->push($tab);

        return $tab;
    }

    /**
     * @param string $action
     */
    public function setAction($action)
    {
        $this->getTabs()->each(function ($tab) use($action) {
            if ($tab instanceof FormInterface) {
                $tab->setAction($action);
            }
        });
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->getTabs()->each(function ($tab) use($id) {
            if ($tab instanceof FormInterface) {
                $tab->setId($id);
            }
        });
    }

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return Validator|null
     */
    public function validateForm(ModelConfigurationInterface $model)
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab instanceof FormInterface) {
                $result = $tab->validateForm($model);
                if (! is_null($result)) {
                    return $result;
                }
            }
        }
    }

    /**
     * @param ModelConfigurationInterface $model
     */
    public function saveForm(ModelConfigurationInterface $model)
    {
        $this->getTabs()->each(function ($tab) use($model) {
            if ($tab instanceof FormInterface) {
                $tab->saveForm($model);
            }
        });
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

    /**
     * Set currently rendered instance.
     *
     * @param Model $model
     */
    public function setModel(Model $model)
    {
        $this->getTabs()->each(function ($tab) use($model) {
            if ($tab->getContent() instanceof ElementsInterface) {
                $tab->getContent()->setModel($model);
            }
        });
    }

    /**
     * Get form item validation rules.
     * @return mixed
     */
    public function getValidationRules()
    {
        $rules = [];

        $this->getTabs()->each(function ($tab) use(&$rules) {
            if ($tab->getContent() instanceof ElementsInterface) {
                $rules += $tab->getContent()->getValidationRules();
            }
        });

        return $rules;
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        $messages = [];

        $this->getTabs()->each(function ($tab) use (&$messages) {
            if ($tab->getContent() instanceof ElementsInterface) {
                $messages += $tab->getContent()->getValidationMessages();
            }
        });

        return $messages;
    }

    /**
     * @return array
     */
    public function getValidationLabels()
    {
        $labels = [];

        $this->getTabs()->each(function ($tab) use (&$labels) {
            if ($tab->getContent() instanceof ElementsInterface) {
                $labels += $tab->getContent()->getValidationLabels();
            }
        });

        return $labels;
    }

    /**
     * Save form item.
     */
    public function save()
    {
        $this->getTabs()->each(function ($tab) {
            if ($tab->getContent() instanceof ElementsInterface) {
                $tab->getContent()->save();
            }
        });
    }

    /**
     * Save form item.
     */
    public function afterSave()
    {
        $this->getTabs()->each(function ($tab) {
            if ($tab->getContent() instanceof ElementsInterface) {
                $tab->getContent()->afterSave();
            }
        });
    }
}

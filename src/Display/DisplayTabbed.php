<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Traits\FormElements;

/**
 * @property TabInterface[]|Collection $elements
 */
class DisplayTabbed implements DisplayInterface, FormInterface
{
    use FormElements;

    /**
     * @var string
     */
    protected $view = 'display.tabbed';

    /**
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @var DisplayFactoryInterface
     */
    protected $displayFactory;

    /**
     * DisplayTabbed constructor.
     *
     * @param Closure|TabInterface[] $tabs
     * @param TemplateInterface $template
     * @param DisplayFactoryInterface $displayFactory
     */
    public function __construct($tabs, TemplateInterface $template, DisplayFactoryInterface $displayFactory)
    {
        $this->template = $template;
        $this->displayFactory = $displayFactory;
        $this->elements = new Collection();

        if (is_array($tabs) or is_callable($tabs)) {
            $this->setTabs($tabs);
        }
    }

    public function initialize()
    {
        $this->initializeElements();

        $activeTabs = $this->getTabs()->filter(function (TabInterface $tab) {
            return $tab->isActive();
        })->count();

        if ($activeTabs === 0 and $firstTab = $this->getTabs()->first()) {
            $firstTab->setActive(true);
        }
    }

    /**
     * @param string $class
     */
    public function setModelClass($class)
    {
        $this->getTabs()->each(function (TabInterface $tab) use ($class) {
            if ($tab instanceof DisplayInterface) {
                $tab->setModelClass($class);
            }
        });
    }

    /**
     * @return TabInterface[]|Collection
     */
    public function getTabs()
    {
        return $this->getElements();
    }

    /**
     * @param Closure|TabInterface[] $tabs
     *
     * @return $this
     */
    public function setTabs($tabs)
    {
        if (is_callable($tabs)) {
            $tabs = call_user_func($tabs, $this);
        }

        return $this->setElements($tabs);
    }

    /**
     * @param array $elements
     *
     * @return $this
     */
    public function setElements(array $elements)
    {
        foreach ($elements as $label => $tab) {
            if ($tab instanceof TabInterface) {
                $this->addElement($tab);
            } else {
                $this->appendTab($tab, $label);
            }
        }

        return $this;
    }

    /**
     * @param Renderable $display
     * @param string $label
     * @param bool|false $active
     *
     * @return TabInterface
     */
    public function appendTab(Renderable $display, $label, $active = false)
    {
        $tab = $this->displayFactory->tab($display)->setLabel($label)->setActive($active);

        $this->addElement($tab);

        return $tab;
    }

    /**
     * @param TabInterface $element
     *
     * @return $this
     */
    public function addElement(TabInterface $element)
    {
        $this->elements->push($element);

        return $this;
    }

    /**
     * @param string $action
     */
    public function setAction($action)
    {
        $this->getTabs()->each(function (TabInterface $tab) use ($action) {
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
        $this->getTabs()->each(function (TabInterface $tab) use ($id) {
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
        $this->getTabs()->each(function (TabInterface $tab) use ($model) {
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
        return $this->template->view(
            $this->getView(),
            $this->toArray()
        )->render();
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }

    /**
     * Using in trait FormElements;.
     *
     * @param $object
     *
     * @return mixed
     */
    protected function getElementContainer($object)
    {
        return $object->getContent();
    }

    /**
     * @return Model $model
     */
    public function getModel()
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab->getContent() instanceof FormInterface) {
                return $tab->getContent()->getModel();
            }
        }
    }
}

<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Traits\FormElements;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Traits\VisibleCondition;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

/**
 * @property TabInterface[]|DisplayTabsCollection $elements
 */
class DisplayTabbed implements DisplayInterface, FormInterface
{
    use FormElements, VisibleCondition, \SleepingOwl\Admin\Traits\Renderable;

    /**
     * @var string
     */
    protected $view = 'display.tabbed';

    /**
     * DisplayTabbed constructor.
     *
     * @param Closure|TabInterface[] $tabs
     */
    public function __construct($tabs = null)
    {
        $this->elements = new DisplayTabsCollection();

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
     * @return Model $model|null
     */
    public function getModel()
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab->getContent() instanceof FormInterface) {
                return $tab->getContent()->getModel();
            }
        }
    }

    /**
     * @param string $class
     *
     * @return $this
     */
    public function setModelClass($class)
    {
        $this->getTabs()->each(function (TabInterface $tab) use ($class) {
            if ($tab instanceof DisplayInterface) {
                $tab->setModelClass($class);
            }
        });

        return $this;
    }

    /**
     * @return TabInterface[]|DisplayTabsCollection
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
        $this->addElement(
            $tab = app('sleeping_owl.display')->tab($display, $label)->setActive($active)
        );

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
     *
     * @return $this
     */
    public function setAction($action)
    {
        $this->getTabs()->each(function (TabInterface $tab) use ($action) {
            if ($tab instanceof FormInterface) {
                $tab->setAction($action);
            }
        });

        return $this;
    }

    /**
     * @param int $id
     *
     * @return $this
     */
    public function setId($id)
    {
        $this->getTabs()->each(function (TabInterface $tab) use ($id) {
            if ($tab instanceof FormInterface) {
                $tab->setId($id);
            }
        });

        return $this;
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param ModelConfigurationInterface $model
     *
     * @return void
     */
    public function validateForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $model = null)
    {
        $this->getTabs()->each(function ($tab) use ($request, $model) {
            if ($tab instanceof FormInterface) {
                $tab->validateForm($request, $model);
            }
        });
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param ModelConfigurationInterface $model
     *
     * @return void
     */
    public function saveForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $model = null)
    {
        $this->getTabs()->each(function (TabInterface $tab) use ($request, $model) {
            if ($tab instanceof FormInterface) {
                $tab->saveForm($request, $model);
            }
        });
    }

    /**
     * @return null
     */
    public function getValue()
    {
    }

    /**
     * @return bool
     */
    public function isReadonly()
    {
        return false;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'tabs' => $this->getTabs()->onlyVisible(),
        ];
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
}

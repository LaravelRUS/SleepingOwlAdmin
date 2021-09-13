<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\DisplayInterface;
use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Model\SectionModelConfiguration;
use SleepingOwl\Admin\Traits\FormElements;
use SleepingOwl\Admin\Traits\Renderable as AdminRenderable;
use SleepingOwl\Admin\Traits\VisibleCondition;

/**
 * @property TabInterface[]|DisplayTabsCollection $elements
 */
class DisplayTabbed implements DisplayInterface, FormInterface
{
    use FormElements, VisibleCondition, AdminRenderable, HtmlAttributes;

    /**
     * @var string
     */
    protected $view = 'display.tabbed';

    /**
     * DisplayTabbed constructor.
     *
     * @param  Closure|TabInterface[]  $tabs
     */
    public function __construct($tabs = null)
    {
        $this->elements = new DisplayTabsCollection();

        if (is_array($tabs) || is_callable($tabs)) {
            $this->setTabs($tabs);
        }
    }

    /**
     * Initialize tabbed interface.
     */
    public function initialize()
    {
        $this->initializeElements();

        $tabs = $this->getTabs();

        foreach ($tabs as $tab) {
            if (method_exists($tab->getContent(), 'getElements')) {
                $elements = $tab->getContent()->getElements();
                foreach ($elements as $element) {
                    if ($element instanceof self) {
                        foreach ($element->getTabs() as $subTab) {
                            if ($subTab->getName() == session('sleeping_owl_tab_id')) {
                                $tab->setActive(true);
                                $subTab->setActive(true);
                            }
                        }
                    }
                }
            }

            if ($tab->getName() == session('sleeping_owl_tab_id')) {
                $tab->setActive(true);
            }
        }

        $activeTabs = $this->getTabs()->filter(function (TabInterface $tab) {
            return $tab->isActive();
        })->count();

        if ($activeTabs === 0 && $firstTab = $this->getTabs()->first()) {
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
     * @param  string  $class
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
     * @return TabInterface[]|\SleepingOwl\Admin\Form\FormElementsCollection
     */
    public function getTabs()
    {
        return $this->getElements();
    }

    /**
     * @param  Closure|TabInterface[]  $tabs
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
     * @param  array  $elements
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
     * @param  Renderable  $display
     * @param  string  $label
     * @param  bool|false  $active
     * @return DisplayTab
     */
    public function appendTab(Renderable $display, $label, $active = false)
    {
        $this->addElement(
            $tab = app('sleeping_owl.display')->tab($display, $label)->setActive($active)
        );

        return $tab;
    }

    /**
     * @param  TabInterface  $element
     * @return $this
     */
    public function addElement(TabInterface $element)
    {
        $this->elements->push($element);

        return $this;
    }

    /**
     * @param  string  $action
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
     * @param  int  $id
     * @return $this
     */
    public function setId($id)
    {
        $model_class = get_class($this->getModel());
        $this->getTabs()->each(function (TabInterface $tab) use ($id, $model_class) {
            if ($tab instanceof FormInterface) {
                if (! $tab->getExternalForm()) {
                    $tab_content = $tab->getContent();
                    if ($tab_content instanceof FormInterface) {
                        $tab_model = $tab->getModel();
                        $set_id = $model_class == get_class($tab_model);
                        $tab_model_section = \AdminSection::getModel($tab_model);
                        if (is_object($tab_model_section) && $tab_model_section instanceof SectionModelConfiguration) {
                            $set_id = $set_id && $tab->getContent()->getAction() == $tab_model_section->getUpdateUrl($id);
                        }
                        if ($set_id) {
                            $tab->setId($id);
                        }
                    }
                }
            }
        });

        return $this;
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  ModelConfigurationInterface  $model
     * @return void
     */
    public function validateForm(Request $request, ModelConfigurationInterface $model = null)
    {
        $this->getTabs()->each(function ($tab) use ($request, $model) {
            $tabId = $request->get('sleeping_owl_tab_id');

            if ($tab instanceof FormInterface && $tab->getName() == $tabId) {
                $tab->validateForm($request, $model);
            }
        });
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  ModelConfigurationInterface  $model
     * @return void
     */
    public function saveForm(Request $request, ModelConfigurationInterface $model = null)
    {
        $this->getTabs()->each(function (TabInterface $tab) use ($request, $model) {
            $tabId = $request->get('sleeping_owl_tab_id');

            if ($tab instanceof FormInterface && $tab->getName() == $tabId) {
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
     * @return bool
     */
    public function getVisibled()
    {
        return true;
    }

    /**
     * @return bool
     */
    public function isValueSkipped()
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
            'classAttributes' => $this->getHtmlAttribute('class'),
        ];
    }

    /**
     * Using in trait FormElements;.
     *
     * @param $object
     * @return mixed
     */
    protected function getElementContainer($object)
    {
        return $object->getContent();
    }
}

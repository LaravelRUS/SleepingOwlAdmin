<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Traits\FormElements;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Validator;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface;

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
     * @var ModelConfigurationInterface
     */
    protected $modelConfiguration;

    /**
     * DisplayTabbed constructor.
     *
     * @param TemplateInterface $template
     * @param DisplayFactoryInterface $displayFactory
     * @param Closure|TabInterface[] $tabs
     */
    public function __construct(TemplateInterface $template, DisplayFactoryInterface $displayFactory, $tabs = null)
    {
        $this->displayFactory = $displayFactory;
        $this->elements = new Collection();
        $this->template = $template;

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
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $model)
    {
        $this->modelConfiguration = $model;

        $this->getTabs()->each(function (TabInterface $tab) use ($model) {
            if ($tab instanceof DisplayInterface) {
                $tab->setModelConfiguration($model);
            }
        });

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
        $tab = $this->displayFactory->tab($display, $label, null)->setActive($active);

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
     * @param \Illuminate\Http\Request $request
     * @param \Illuminate\Contracts\Validation\Factory $validator
     *
     * @return Validator|null
     */
    public function validateForm(ModelConfigurationInterface $model, \Illuminate\Http\Request $request, \Illuminate\Contracts\Validation\Factory $validator)
    {
        foreach ($this->getTabs() as $tab) {
            if ($tab instanceof FormInterface) {
                $result = $tab->validateForm($model, $request, $validator);
                if (! is_null($result)) {
                    return $result;
                }
            }
        }
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param \Illuminate\Http\Request $request
     */
    public function saveForm(ModelConfigurationInterface $model, \Illuminate\Http\Request $request)
    {
        $this->getTabs()->each(function (TabInterface $tab) use ($model, $request) {
            if ($tab instanceof FormInterface) {
                $tab->saveForm($model, $request);
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

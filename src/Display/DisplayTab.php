<?php

namespace SleepingOwl\Admin\Display;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\DisplayInterface;
use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Exceptions\Display\DisplayTabException;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\Columns\Columns;
use SleepingOwl\Admin\Form\Element\Hidden;
use SleepingOwl\Admin\Form\FormCard;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Form\FormElementsCollection;
use SleepingOwl\Admin\Navigation\Badge;
use SleepingOwl\Admin\Traits\FormElementsRecursiveIterator;
use SleepingOwl\Admin\Traits\VisibleCondition;

class DisplayTab implements TabInterface, DisplayInterface, FormInterface
{
    use VisibleCondition, \SleepingOwl\Admin\Traits\Renderable, HtmlAttributes, FormElementsRecursiveIterator;

    /**
     * @var string
     */
    protected string $label;

    /**
     * @var bool
     */
    protected bool $active = false;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected string $icon;

    /**
     * @var Renderable
     */
    protected $content;

    /**
     * @var string|Closure|Badge|null
     */
    protected Badge|string|Closure|null $badge;

    /**
     * @var bool
     */
    protected bool $external_form = false;

    /**
     * @var string
     */
    protected string $view = 'display.tab';

    /**
     * @param  Renderable  $content
     * @param string|null $label
     * @param string|null $icon
     * @param Closure|string|Badge|null $badge
     */
    public function __construct(Renderable $content, string $label = null, string $icon = null, Closure|Badge|string $badge = null)
    {
        $this->content = $content;

        if (! is_null($label)) {
            $this->setLabel($label);
        }

        if (! is_null($icon)) {
            $this->setIcon($icon);
        }

        if (! is_null($badge)) {
            $this->setBadge($badge);
        }

        $this->setHtmlAttribute('data-toggle', 'tab');
        $this->setHtmlAttribute('class', 'nav-item nav-link');
    }

    /**
     * @param Closure|string|Badge|null $badge
     * @return $this
     */
    public function setBadge(Closure|Badge|string|null $badge): DisplayTab
    {
        $badgeData = null;

        if (is_string($badge) || is_callable($badge) || is_numeric($badge)) {
            $badgeData = new Badge();
            $badgeData->setView('_partials.tabs.badge');
            $badgeData->setValue($badge);
        }

        $this->badge = $badgeData;

        return $this;
    }

    /**
     * @return string|Closure|Badge|null
     */
    public function getBadge(): string|Closure|null|Badge
    {
        return $this->badge;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @param string $label
     * @return $this
     */
    public function setLabel(string $label): DisplayTab
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->active;
    }

    /**
     * @param bool $active
     * @return $this
     */
    public function setActive(bool $active = true)
    {
        $this->active = (bool) $active;

        if ($active) {
            $this->setHtmlAttribute('class', 'active');
        }

        return $this;
    }

    /**
     * @return $this
     *
     * @throws DisplayTabException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     */
    public function addTabElement()
    {
        if ($this->content instanceof FormInterface) {
            $this->content->addElement(
                new FormElements([
                    (new Hidden('sleeping_owl_tab_id'))->setDefaultValue($this->getName()),
                ])
            );
        }

        if ($this->content instanceof FormElements) {
            foreach ($this->content->getElements() as $element) {
                if ($element instanceof FormDefault && $element instanceof FormCard) {
                    $element->addElement(
                        new FormElements([
                            (new Hidden('sleeping_owl_tab_id'))->setDefaultValue($this->getName()),
                        ])
                    );
                }

                if ($element instanceof FormElements) {
                    foreach ($element->getElements() as $subElement) {
                        if ($subElement instanceof FormDefault) {
                            $subElement->addElement(
                                new FormElements([
                                    (new Hidden('sleeping_owl_tab_id'))->setDefaultValue($this->getName()),
                                ])
                            );
                        }
                    }
                }

                if ($element instanceof Columns) {
                    foreach ($element->getElements() as $column) {
                        if ($column instanceof Column) {
                            foreach ($column->getElements() as $columnElement) {
                                if ($columnElement instanceof FormInterface) {
                                    $columnElement->addElement(
                                        new FormElements([
                                            (new Hidden('sleeping_owl_tab_id'))->setDefaultValue($this->getName()),
                                        ])
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        return $this;
    }

    /**
     * @return string
     *
     * @throws DisplayTabException
     */
    public function getName(): string
    {
        if (is_null($this->name) && is_null($this->getLabel())) {
            throw new DisplayTabException('You should set name or label');
        }

        return is_null($this->name)
            ? md5($this->getLabel())
            : $this->name;
    }

    /**
     * @param  string  $name
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
    public function getIcon(): string
    {
        return $this->icon;
    }

    /**
     * @param  string  $icon
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
    public function getContent(): Renderable
    {
        return $this->content;
    }

    /**
     * @param string $class
     * @return $this
     */
    public function setModelClass(string $class): DisplayTab
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
     * @return $this
     */
    public function setAction(string $action)
    {
        if (($content = $this->getContent()) instanceof FormInterface) {
            $content->setAction($action);
        }

        return $this;
    }

    /**
     * @param  bool  $bool
     * @return $this
     */
    public function setExternalForm($bool)
    {
        $this->external_form = $bool;

        return $this;
    }

    /**
     * @return bool
     */
    public function getExternalForm()
    {
        return $this->external_form;
    }

    /**
     * @param int $id
     * @return $this
     */
    public function setId(int $id)
    {
        if (($content = $this->getContent()) instanceof FormInterface) {
            $content->setId($id);
        }

        return $this;
    }

    /**
     * @param  Request  $request
     * @param  ModelConfigurationInterface  $model
     *
     * @throws ValidationException
     */
    public function validateForm(Request $request, ModelConfigurationInterface $model = null)
    {
        if (($content = $this->getContent()) instanceof FormInterface) {
            $content->validateForm($request, $model);
        }
    }

    /**
     * Save model.
     *
     * @param  Request  $request
     * @param  ModelConfigurationInterface  $model
     * @return void
     */
    public function saveForm(Request $request, ModelConfigurationInterface $model = null)
    {
        if (($content = $this->getContent()) instanceof FormInterface) {
            $content->saveForm($request, $model);
        }
    }

    /**
     * Set currently rendered instance.
     *
     * @param  Model  $model
     * @return $this
     */
    public function setModel(Model $model): DisplayTab
    {
        if (($content = $this->getContent()) instanceof WithModelInterface) {
            $content->setModel($model);
        }

        return $this;
    }

    /**
     * @return Model $model
     */
    public function getModel(): Model
    {
        if (($content = $this->getContent()) instanceof WithModelInterface) {
            return $content->getModel();
        }
    }

    /**
     * Get form item validation rules.
     *
     * @return array
     */
    public function getValidationRules(): array
    {
        if (($content = $this->getContent()) instanceof Validable) {
            return $content->getValidationRules();
        }

        return [];
    }

    /**
     * @return array
     */
    public function getValidationMessages(): array
    {
        if (($content = $this->getContent()) instanceof Validable) {
            return $content->getValidationMessages();
        }

        return [];
    }

    /**
     * @return array
     */
    public function getValidationLabels(): array
    {
        if (($content = $this->getContent()) instanceof Validable) {
            return $content->getValidationLabels();
        }

        return [];
    }

    /**
     * @param  Request  $request
     * @return void
     */
    public function save(Request $request)
    {
        if (($content = $this->getContent()) instanceof FormElementInterface) {
            $content->save($request);
        }
    }

    /**
     * @param  Request  $request
     * @return void
     */
    public function afterSave(Request $request)
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
    public function isReadonly(): bool
    {
        if (($content = $this->getContent()) instanceof FormElementInterface) {
            return $content->isReadonly();
        }

        return false;
    }

    /**
     * @return bool
     */
    public function getVisibled()
    {
        if (($content = $this->getContent()) instanceof FormElementInterface) {
            return $content->getVisibled();
        }

        return false;
    }

    /**
     * @return bool
     */
    public function isValueSkipped(): bool
    {
        if (($content = $this->getContent()) instanceof FormElementInterface) {
            return $content->isValueSkipped();
        }

        return false;
    }

    /**
     * @param string $path
     * @return FormElementInterface|null
     */
    public function getElement(string $path): FormElementInterface|null
    {
        if (($content = $this->getContent()) instanceof ElementsInterface) {
            return $content->getElement($path);
        }
    }

    /**
     * @return FormElementsCollection
     */
    public function getElements(): FormElementsCollection
    {
        if (($content = $this->getContent()) instanceof ElementsInterface) {
            return $content->getElements();
        }

        return new FormElementsCollection();
    }

    /**
     * @param  array  $elements
     * @return $this
     */
    public function setElements(array $elements): DisplayTab
    {
        if (($content = $this->getContent()) instanceof ElementsInterface) {
            $content->setElements($elements);
        }

        return $this;
    }

    /**
     * @return array
     *
     * @throws DisplayTabException
     */
    public function toArray(): array
    {
        return [
            'label' => $this->getLabel(),
            'active' => $this->isActive(),
            'name' => $this->getName(),
            'icon' => $this->getIcon(),
            'badge' => $this->getBadge(),
            'arrayAttributes' => $this->getHtmlAttributes(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }
}

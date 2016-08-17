<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\ColumnInterface;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Form\Element\NamedFormElement;

trait FormElements
{
    /**
     * @var Collection
     */
    protected $elements;

    public function initializeElements()
    {
        $this->getElements()->each(function ($element) {
            if ($element instanceof Initializable) {
                $element->initialize();
            }
        });
    }

    /**
     * @param string $path
     *
     * @return FormElementInterface|null
     */
    public function getElement($path)
    {
        $found = null;

        foreach ($this->getElements() as $element) {
            if ($element instanceof ElementsInterface) {
                if (! is_null($found = $element->getElement($path))) {
                    return $found;
                }
            }

            if ($element instanceof NamedFormElement && $element->getPath() == $path) {
                return $element;
            }
        }
    }

    /**
     * @return Collection
     */
    public function getElements()
    {
        return $this->elements;
    }

    /**
     * @param array $elements
     *
     * @return $this
     */
    public function setElements(array $elements)
    {
        $this->elements = new Collection($elements);

        return $this;
    }

    /**
     * @param FormElementInterface $element
     *
     * @return $this
     */
    public function addElement($element)
    {
        $this->elements->push($element);

        return $this;
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        return $this->setModelForElements($model);
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        return $this->getValidationRulesFromElements();
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        return $this->getValidationMessagesForElements();
    }

    /**
     * @return array
     */
    public function getValidationLabels()
    {
        return $this->getValidationLabelsForElements();
    }

    public function save()
    {
        $this->saveElements();
    }

    public function afterSave()
    {
        $this->afterSaveElements();
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    protected function setModelForElements(Model $model)
    {
        $this->getElements()->each(function ($element) use ($model) {
            $element = $this->getElementContainer($element);
            if ($element instanceof FormElementInterface) {
                $element->setModel($model);
            }

            if ($element instanceof ColumnInterface) {
                $element->setModel($model);
            }
        });

        return $this;
    }

    /**
     * @param array $rules
     *
     * @return array
     */
    protected function getValidationRulesFromElements(array $rules = [])
    {
        $this->getElements()->each(function ($element) use (&$rules) {
            $element = $this->getElementContainer($element);
            if ($element instanceof FormElementInterface) {
                $rules += $element->getValidationRules();
            }
        });

        return $rules;
    }

    /**
     * @param array $messages
     *
     * @return array
     */
    protected function getValidationMessagesForElements(array $messages = [])
    {
        $this->getElements()->each(function ($element) use (&$messages) {
            $element = $this->getElementContainer($element);
            if ($element instanceof NamedFormElement) {
                $messages += $element->getValidationMessages();
            }
        });

        return $messages;
    }

    /**
     * @param array $labels
     *
     * @return array
     */
    protected function getValidationLabelsForElements(array $labels = [])
    {
        $this->getElements()->each(function ($element) use (&$labels) {
            $element = $this->getElementContainer($element);
            if ($element instanceof NamedFormElement) {
                $labels += $element->getValidationLabels();
            }
        });

        return $labels;
    }

    protected function saveElements()
    {
        $this->getElements()->each(function ($element) {
            $element = $this->getElementContainer($element);
            if ($element instanceof FormElementInterface) {
                $element->save();
            }
        });
    }

    protected function afterSaveElements()
    {
        $this->getElements()->each(function ($element) {
            $element = $this->getElementContainer($element);
            if ($element instanceof FormElementInterface) {
                $element->afterSave();
            }
        });
    }

    /**
     * @param $object
     *
     * @return mixed
     */
    protected function getElementContainer($object)
    {
        return $object;
    }
}

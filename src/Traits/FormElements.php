<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModel;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Form\FormElementsCollection;
use SleepingOwl\Admin\Form\Element\NamedFormElement;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;

trait FormElements
{
    /**
     * @var FormElementsCollection
     */
    protected $elements;

    /**
     * @return void
     */
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
     * @return FormElementsCollection
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
        $this->elements = new FormElementsCollection($elements);

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

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
    {
        $this->saveElements($request);
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function afterSave(\Illuminate\Http\Request $request)
    {
        $this->afterSaveElements($request);
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

            if ($element instanceof WithModel) {
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
        $this->getElements()->onlyActive()->each(function ($element) use (&$rules) {
            $element = $this->getElementContainer($element);

            if ($element instanceof Validable) {
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
        $this->getElements()->onlyActive()->each(function ($element) use (&$messages) {
            $element = $this->getElementContainer($element);

            if ($element instanceof Validable) {
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
        $this->getElements()->onlyActive()->each(function ($element) use (&$labels) {
            $element = $this->getElementContainer($element);

            if ($element instanceof Validable) {
                $labels += $element->getValidationLabels();
            }
        });

        return $labels;
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    protected function saveElements(\Illuminate\Http\Request $request)
    {
        $this->getElements()->onlyActive()->each(function ($element) use ($request) {
            $element = $this->getElementContainer($element);

            if ($element instanceof FormElementInterface) {
                $element->save($request);
            }
        });
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    protected function afterSaveElements(\Illuminate\Http\Request $request)
    {
        $this->getElements()->onlyActive()->each(function ($element) use ($request) {
            $element = $this->getElementContainer($element);

            if ($element instanceof FormElementInterface) {
                $element->afterSave($request);
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

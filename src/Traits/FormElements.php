<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Form\Element\NamedFormElement;
use SleepingOwl\Admin\Form\FormElementsCollection;

trait FormElements
{
    use FormElementsRecursiveIterator;

    /**
     * @var FormElementsCollection
     */
    protected FormElementsCollection $elements;

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
     * @param  \Closure  $callback
     * @return bool|void
     */
    public function recursiveIterateElements(\Closure $callback)
    {
        // If Callback function returns TRUE then recurse iterator should stop.
        $result = null;

        foreach ($this->getElements() as $element) {
            if ($element instanceof ElementsInterface) {
                $result = $element->recursiveIterateElements($callback);
            } else {
                $result = $callback($element);
            }

            if ($result === true) {
                break;
            }
        }

        return $result;
    }

    /**
     * @param string $path
     * @return FormElementInterface|null
     */
    public function getElement(string $path): ?FormElementInterface
    {
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

        return null;
    }

    /**
     * @return FormElementsCollection
     */
    public function getElements(): FormElementsCollection
    {
        return $this->elements;
    }

    /**
     * @param  array  $elements
     * @return ElementsInterface
     */
    public function setElements(array $elements): ElementsInterface
    {
        $this->elements = new FormElementsCollection($elements);

        return $this;
    }

    /**
     * @param  FormElementInterface  $element
     * @return $this
     */
    public function addElement($element)
    {
        $this->elements->push($element);

        return $this;
    }

    /**
     * @param Model $model
     * @return WithModelInterface
     */
    public function setModel(Model $model): WithModelInterface
    {
        return $this->setModelForElements($model);
    }

    /**
     * @return array
     */
    public function getValidationRules(): array
    {
        return $this->getValidationRulesFromElements();
    }

    /**
     * @return array
     */
    public function getValidationMessages(): array
    {
        if (is_array(trans('sleeping_owl::validation'))) {
            return trans('sleeping_owl::validation');
        }

        return $this->getValidationMessagesForElements();
    }

    /**
     * @return array
     */
    public function getValidationLabels(): array
    {
        return $this->getValidationLabelsForElements();
    }

    /**
     * @param  Request  $request
     * @return void
     */
    public function save(Request $request)
    {
        $this->saveElements($request);
    }

    /**
     * @param  Request  $request
     * @return void
     */
    public function afterSave(Request $request)
    {
        $this->afterSaveElements($request);
    }

    /**
     * @param  Model  $model
     * @return $this
     */
    protected function setModelForElements(Model $model)
    {
        $this->getElements()->each(function ($element) use ($model) {
            $element = $this->getElementContainer($element);

            if ($element instanceof WithModelInterface) {
                $element->setModel($model);
            }
        });

        return $this;
    }

    /**
     * @param  array  $rules
     * @return array
     */
    protected function getValidationRulesFromElements(array $rules = []): array
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
     * @param  array  $messages
     * @return array
     */
    protected function getValidationMessagesForElements(array $messages = []): array
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
     * @param  array  $labels
     * @return array
     */
    protected function getValidationLabelsForElements(array $labels = []): array
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
     * @param  Request  $request
     * @return void
     */
    protected function saveElements(Request $request)
    {
        $this->getElements()->onlyActive()->each(function ($element) use ($request) {
            $element = $this->getElementContainer($element);

            if ($element instanceof FormElementInterface) {
                $element->save($request);
            }
        });
    }

    /**
     * @param  Request  $request
     * @return void
     */
    protected function afterSaveElements(Request $request)
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
     * @return mixed
     */
    protected function getElementContainer($object): mixed
    {
        return $object;
    }
}

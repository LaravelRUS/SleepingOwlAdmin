<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Form\Element\NamedFormElement;

class FormElements extends FormElement implements ElementsInterface
{
    /**
     * @var Collection
     */
    protected $elements;

    /**
     * Column constructor.
     *
     * @param array $elements
     */
    public function __construct(array $elements = [])
    {
        parent::__construct();

        $this->setElements($elements);
    }

    public function initialize()
    {
        parent::initialize();

        $this->getElements()->each(function ($element) {
            if ($element instanceof Initializable) {
                $element->initialize();
            }
        });
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
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        parent::setModel($model);

        $this->getElements()->each(function ($element) use ($model) {
            if ($element instanceof FormElementInterface) {
                $element->setModel($model);
            }
        });

        return $this;
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        $rules = parent::getValidationRules();

        $this->getElements()->each(function ($element) use (&$rules) {
            if ($element instanceof FormElementInterface) {
                $rules += $element->getValidationRules();
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

        $this->getElements()->each(function ($element) use (&$messages) {
            if ($element instanceof NamedFormElement) {
                $messages += $element->getValidationMessages();
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

        $this->getElements()->each(function ($element) use (&$labels) {
            if ($element instanceof NamedFormElement) {
                $labels += $element->getValidationLabels();
            }
        });

        return $labels;
    }

    public function save()
    {
        parent::save();

        $this->getElements()->each(function ($element) use (&$labels) {
            if ($element instanceof FormElementInterface) {
                $element->save();
            }
        });
    }

    public function afterSave()
    {
        parent::afterSave();

        $this->getElements()->each(function ($element) use (&$labels) {
            if ($element instanceof FormElementInterface) {
                $element->afterSave();
            }
        });
    }
}

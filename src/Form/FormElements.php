<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;

class FormElements extends FormElement implements ElementsInterface
{
    use \SleepingOwl\Admin\Traits\FormElements;

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
        $this->initializeElements();
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        parent::setModel($model);

        return $this->setModelForElements($model);
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        return $this->getValidationRulesFromElements(
            parent::getValidationRules()
        );
    }

    public function save()
    {
        parent::save();

        $this->saveElements();
    }

    public function afterSave()
    {
        parent::afterSave();

        $this->afterSaveElements();
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'items' => $this->getElements(),
        ];
    }
}

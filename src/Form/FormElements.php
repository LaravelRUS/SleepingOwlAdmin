<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;

class FormElements extends FormElement implements ElementsInterface
{
    use \SleepingOwl\Admin\Traits\FormElements;

    /**
     * @var string
     */
    protected $view = 'form.element.formelements';

    /**
     * @param  array  $elements
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
     * @param  Model  $model
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

    /**
     * @param  Request  $request
     * @return void
     */
    public function save(Request $request)
    {
        parent::save($request);

        $this->saveElements($request);
    }

    /**
     * @param  Request  $request
     * @return void
     */
    public function afterSave(Request $request)
    {
        parent::afterSave($request);

        $this->afterSaveElements($request);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'items' => $this->getElements()->onlyVisible(),
        ];
    }
}

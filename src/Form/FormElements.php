<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class FormElements extends FormElement implements ElementsInterface
{
    use \SleepingOwl\Admin\Traits\FormElements;

    /**
     * Column constructor.
     *
     * @param TemplateInterface $template
     * @param array $elements
     */
    public function __construct(TemplateInterface $template, array $elements = [])
    {
        parent::__construct($template);

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
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $model)
    {
        parent::setModelConfiguration($model);

        return $this->setModelConfigurationForElements($model);
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
     * @param Request $request
     */
    public function save(Request $request)
    {
        parent::save($request);

        $this->saveElements($request);
    }

    /**
     * @param Request $request
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
            'items' => $this->getElements(),
        ];
    }
}

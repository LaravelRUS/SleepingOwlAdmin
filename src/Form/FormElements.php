<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Database\Eloquent\Model;
use KodiCMS\Assets\Contracts\MetaInterface;
use KodiCMS\Assets\Contracts\PackageManagerInterface;
use SleepingOwl\Admin\Contracts\Form\ElementsInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;

class FormElements extends FormElement implements ElementsInterface
{
    use \SleepingOwl\Admin\Traits\FormElements;

    /**
     * FormElements constructor.
     *
     * @param array $elements
     * @param PackageManagerInterface $packageManager
     * @param MetaInterface $meta
     * @param TemplateInterface $template
     */
    public function __construct(array $elements = [],
                                PackageManagerInterface $packageManager,
                                MetaInterface $meta,
                                TemplateInterface $template)
    {
        parent::__construct($packageManager, $meta, $template);

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

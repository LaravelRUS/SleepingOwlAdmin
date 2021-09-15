<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Traits\SelectOptionsFromModel;

class Select extends EditableColumn implements ColumnEditableInterface
{
    use SelectOptionsFromModel;

    /**
     * @var string
     */
    protected $view = 'column.editable.select';

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @var null
     */
    protected $relationKey = null;

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var array
     */
    protected $optionList = [];

    /**
     * @var array
     */
    protected $exclude = [];

    /**
     * @var bool
     */
    protected $sortable = true;

    /**
     * @var null
     */
    protected $defaultValue = null;

    /**
     * Select constructor.
     *
     * @param $name
     * @param  null  $label
     * @param  array  $options
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     */
    public function __construct($name, $label = null, $options = [], $small = null)
    {
        parent::__construct($name, $label, $small);

        if (is_array($options)) {
            $this->setOptions($options);
        } elseif (($options instanceof Model) || is_string($options)) {
            $this->setModelForOptions($options);
        }
    }

    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        if (is_null($this->modifier)) {
            return $this->getOptionName($this->getModelValue());
        }

        return $this->modifier;
    }

    /**
     * @param $relationKey
     * @return $this
     */
    public function setRelationKey($relationKey)
    {
        $this->relationKey = $relationKey;

        return $this;
    }

    /**
     * @return null
     */
    public function getRelationKey()
    {
        return $this->relationKey;
    }

    /**
     * @param $defaultValue
     * @return $this
     */
    public function setDefaultValue($defaultValue)
    {
        $this->defaultValue = $defaultValue;

        return $this;
    }

    /**
     * @return null
     */
    public function getDefaultValue()
    {
        return $this->defaultValue;
    }

    /**
     * @param  bool  $sortable
     * @return $this
     */
    public function setSortable($sortable)
    {
        $this->sortable = (bool) $sortable;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSortable()
    {
        return $this->sortable;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        if (! is_null($this->getModelForOptions()) && ! is_null($this->getDisplay())) {
            $this->setOptions(
                $this->loadOptions()
            );
        }

        $options = Arr::except($this->options, $this->exclude);
        if ($this->isSortable()) {
            asort($options);
        }

        return $options;
    }

    /**
     * @return array
     */
    public function mutateOptions()
    {
        $options = [];

        $this->optionList = $this->getOptions();

        foreach ($this->optionList as $key => $value) {
            $options[] = ['value' => $key, 'text' => $value];
        }

        return $options;
    }

    /**
     * @param $key
     * @return mixed|null
     */
    public function getOptionName($value)
    {
        if (isset($value)) {
            if (isset($this->optionList[$value])) {
                return $this->optionList[$value];
            }

            return $value;
        }
    }

    /**
     * @param array
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @param  array  $values
     * @return $this
     */
    public function setEnum(array $values)
    {
        return $this->setOptions(array_combine($values, $values));
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array_merge(parent::toArray(), [
            'options' => $this->mutateOptions(),
            /*
             * Param "optionName" do not used anywhere
             */
            //'optionName' => $this->getOptionName($this->getModelValue()),
            'text' => $this->getModifierValue(),
        ]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     */
    public function save(Request $request)
    {
        $model = $this->getModel();

        if (strpos($this->getName(), '.') !== false) {
            if ($this->getRelationKey()) {
                $this->setName($this->getRelationKey());
            } else {
                //@TODO Make Relation Resolver
                $relationName = explode('.', $this->getName());
            }
        }

        $form = new FormDefault([
            new \SleepingOwl\Admin\Form\Element\Select(
                $this->getName()
            ),
        ]);

        $array = [];
        Arr::set($array, $this->getName(), $request->input('value', $this->getDefaultValue()));

        $request->merge($array);

        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());

        $form->saveForm($request);
    }
}

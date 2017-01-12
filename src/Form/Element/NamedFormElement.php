<?php

namespace SleepingOwl\Admin\Form\Element;

use LogicException;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Form\FormElement;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use SleepingOwl\Admin\Exceptions\Form\FormElementException;

abstract class NamedFormElement extends FormElement
{
    /**
     * @var string
     */
    protected $path;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $modelAttributeKey;

    /**
     * @var string
     */
    protected $label;

    /**
     * @var string
     */
    protected $helpText;

    /**
     * @var mixed
     */
    protected $defaultValue;

    /**
     * @var \Closure
     */
    protected $mutator;

    /**
     * @param string $path
     * @param string|null $label
     *
     * @throws FormElementException
     */
    public function __construct($path, $label = null)
    {
        if (empty($path)) {
            throw new FormElementException('You must specify field path');
        }

        $this->setPath($path);
        $this->setLabel($label);

        $parts = explode('.', $path);
        $this->setName($this->composeName($parts));
        $this->setModelAttributeKey(end($parts));

        parent::__construct();
    }

    /**
     * Compose html name from array like this: 'first[second][third]'.
     *
     * @param array $parts
     *
     * @return string
     */
    private function composeName(array $parts)
    {
        $name = array_shift($parts);

        while (! empty($parts)) {
            $part = array_shift($parts);
            $name .= "[$part]";
        }

        return $name;
    }

    /**
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * @param string $path
     *
     * @return $this
     */
    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
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
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param string $label
     *
     * @return $this
     */
    public function setLabel($label)
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return string
     */
    public function getModelAttributeKey()
    {
        return $this->modelAttributeKey;
    }

    /**
     * @param string $key
     *
     * @return $this
     */
    public function setModelAttributeKey($key)
    {
        $this->modelAttributeKey = $key;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getDefaultValue()
    {
        return $this->defaultValue;
    }

    /**
     * @param mixed $defaultValue
     *
     * @return $this
     */
    public function setDefaultValue($defaultValue)
    {
        $this->defaultValue = $defaultValue;

        return $this;
    }

    /**
     * @return string
     */
    public function getHelpText()
    {
        if ($this->helpText instanceof Htmlable) {
            return $this->helpText->toHtml();
        }

        return $this->helpText;
    }

    /**
     * @param string|Htmlable $helpText
     *
     * @return $this
     */
    public function setHelpText($helpText)
    {
        $this->helpText = $helpText;

        return $this;
    }

    /**
     * @param string|null $message
     *
     * @return $this
     */
    public function required($message = null)
    {
        $this->addValidationRule('required', $message);

        return $this;
    }

    /**
     * @param string|null $message
     *
     * @return $this
     */
    public function unique($message = null)
    {
        $this->addValidationRule('_unique');

        if (! is_null($message)) {
            $this->addValidationMessage('unique', $message);
        }

        return $this;
    }

    /**
     * @return array
     */
    public function getValidationMessages()
    {
        $messages = parent::getValidationMessages();

        foreach ($messages as $rule => $message) {
            $messages[$this->getName().'.'.$rule] = $message;
            unset($messages[$rule]);
        }

        return $messages;
    }

    /**
     * @return array
     */
    public function getValidationLabels()
    {
        return [$this->getPath() => $this->getLabel()];
    }

    /**
     * If FormElement has `_unique` rule, it will get all appropriate
     * validation rules based on underlying model.
     *
     * @return array
     */
    public function getValidationRules()
    {
        $rules = parent::getValidationRules();

        foreach ($rules as &$rule) {
            if ($rule !== '_unique') {
                continue;
            }

            $model = $this->resolvePath();
            $table = $model->getTable();

            $rule = 'unique:'.$table.','.$this->getModelAttributeKey();
            if ($model->exists) {
                $rule .= ','.$model->getKey();
            }
        }
        unset($rule);

        return [$this->getPath() => $rules];
    }

    /**
     * Get model related to form element.
     *
     * @return mixed
     */
    public function resolvePath()
    {
        $model = $this->getModel();
        $relations = explode('.', $this->getPath());
        $count = count($relations);

        if ($count === 1) {
            return $model;
        }

        foreach ($relations as $relation) {
            if ($count === 1) {
                return $model;
            }

            if ($model->exists && ($value = $model->getAttribute($relation)) instanceof Model) {
                $model = $value;

                $count--;
                continue;
            }

            if (method_exists($model, $relation)) {
                $relation = $model->{$relation}();

                if ($relation instanceof Relation) {
                    $model = $relation->getModel();
                    $count--;
                    continue;
                }
            }

            break;
        }

        throw new LogicException("Can not resolve path for field '{$this->getPath()}'. Probably relation definition is incorrect");
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return array|string
     */
    public function getValueFromRequest(\Illuminate\Http\Request $request)
    {
        if ($request->hasSession() && ! is_null($value = $request->old($this->getPath()))) {
            return $value;
        }

        return $request->input($this->getPath());
    }

    /**
     * @return mixed
     */
    public function getValueFromModel()
    {
        if (! is_null($value = $this->getValueFromRequest(request()))) {
            return $value;
        }

        $model = $this->getModel();
        $path = $this->getPath();
        $value = $this->getDefaultValue();

        if (is_null($model) or ! $model->exists) {
            return $value;
        }

        $relations = explode('.', $path);
        $count = count($relations);

        if ($count === 1) {
            return $model->getAttribute($this->getModelAttributeKey());
        }

        foreach ($relations as $relation) {
            if ($model->{$relation} instanceof Model) {
                $model = $model->{$relation};
                continue;
            }

            if ($count === 2) {
                return $model->getAttribute($relation);
            }

            throw new LogicException("Can not fetch value for field '{$path}'. Probably relation definition is incorrect");
        }

        return $value;
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
    {
        $this->setModelAttribute(
            $this->getValueFromRequest(
                $request
            )
        );
    }

    /**
     * @param mixed  $value
     *
     * @return void
     */
    public function setModelAttribute($value)
    {
        $model = $this->getModelByPath(
            $this->getPath()
        );

        $model->setAttribute(
            $this->getModelAttributeKey(),
            $this->prepareValue($value)
        );
    }

    /**
     * @param string $path
     *
     * @return Model|null
     */
    protected function getModelByPath($path)
    {
        $model = $this->getModel();

        $relations = explode('.', $path);
        $count = count($relations);
        $i = 1;

        if ($count > 1) {
            $i++;
            $previousModel = $model;

            /* @var Model $model */
            foreach ($relations as $relation) {
                $relatedModel = null;
                if ($previousModel->getAttribute($relation) instanceof Model) {
                    $relatedModel = $previousModel->getAttribute($relation);
                } elseif (method_exists($previousModel, $relation)) {

                    /* @var Relation $relation */
                    $relationObject = $previousModel->{$relation}();

                    switch (get_class($relationObject)) {
                        case BelongsTo::class:
                            $relationObject->associate($relatedModel = $relationObject->getRelated());
                            break;
                        case HasOne::class:
                        case MorphOne::class:
                            $relatedModel = $relationObject->getRelated()->newInstance();
                            $relatedModel->setAttribute($relationObject->getPlainForeignKey(), $relationObject->getParentKey());
                            $model->setRelation($relation, $relatedModel);
                            break;
                    }
                }

                $previousModel = $relatedModel;
                if ($i === $count) {
                    break;
                } elseif (is_null($relatedModel)) {
                    throw new LogicException("Field [{$path}] can't be mapped to relations of model ".get_class($model)
                        .'. Probably some dot delimeted segment is not a supported relation type');
                }
            }

            $model = $previousModel;
        }

        return $model;
    }

    /**
     * Field->mutateValue(function($value) {
     *     return bcrypt($value);
     * }).
     *
     * @param \Closure $mutator
     *
     * @return $this
     */
    public function mutateValue(\Closure $mutator)
    {
        $this->mutator = $mutator;

        return $this;
    }

    /**
     * @return bool
     */
    public function hasMutator()
    {
        return is_callable($this->mutator);
    }

    /**
     * @param mixed $value
     *
     * @return mixed
     */
    public function prepareValue($value)
    {
        if ($this->hasMutator()) {
            $value = call_user_func($this->mutator, $value);
        }

        return $value;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array_merge(parent::toArray(), [
            'id' => $this->getName(),
            'value' => $this->getValueFromModel(),
            'name' => $this->getName(),
            'path' => $this->getPath(),
            'label' => $this->getLabel(),
            'helpText' => $this->getHelpText(),
            'required' => in_array('required', $this->validationRules),
        ]);
    }
}

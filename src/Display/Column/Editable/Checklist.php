<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Form\FormDefault;

class Checklist extends Select implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.checklist';

    protected $forceSaveRelation = null;

    /**
     * @return mixed|null
     */
    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        /**
         * It's useless to modify output here, because of it's will be changed by js-script on the frontend after updating.
         *
         * @see https://vitalets.github.io/x-editable/docs.html#editable - option "display"
         */
        /*
        if (is_null($this->modifier)) {
            $return = parent::getValueFromObject($this->getModel(), $this->getName());

            $return = $return->pluck($this->getDisplay());
            if ($this->isSortable()) {
                $return = $return->sort();
            }

            return $return->implode('<br/>');
        }
        */

        return $this->modifier;
    }

    /**
     * @return array|\Illuminate\Database\Eloquent\Collection|mixed|string|null
     */
    public function getModelValue()
    {
        $return = parent::getModelValue();

        if ($return instanceof \Illuminate\Database\Eloquent\Collection) {
            if ($return->count()) {
                /**
                 * Primary key of the Eloquent model always must be a simple, not composite: string, but not array.
                 *
                 * @see https://github.com/laravel/framework/issues/5517#issuecomment-170035596
                 */
                try {
                    $key_name = $return->first()->getKeyName();
                } catch (Exception $e) {
                    $key_name = 'id';
                }
                /**
                 * Let's try not to break the whole application.
                 */
                try {
                    $return = $return->pluck($key_name)->toArray();
                } catch (Exception $e) {
                    $return = [];
                }
            } else {
                $return = [];
            }
        } elseif ($return instanceof \Illuminate\Support\Collection) {
            $return = $return->toArray();
        }

        if (is_array($return)) {
            $return = implode(',', $return);
        }

        return $return;
    }

    /**
     * @param  Request  $request
     * @return string|void
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     * @throws \SleepingOwl\Admin\Exceptions\RepositoryException
     * @throws Exception
     */
    public function save(Request $request)
    {
        $model = $this->getModel();

        $element = new \SleepingOwl\Admin\Form\Element\MultiSelect($this->getName());

        /**
         * Detect relation.
         */
        if ($this->getModelForOptions()) {
            $element->setModelForOptions($this->getModelForOptions());
        } elseif (null !== ($forceSaveRelation = $this->getForceSaveRelation())) {
            if ($forceSaveRelation instanceof Model) {
                $element->setModelForOptions(get_class($forceSaveRelation));
            } elseif (is_callable($forceSaveRelation)) {
                $modelClassName = call_user_func($forceSaveRelation, $this);
                if ($modelClassName instanceof Model) {
                    $modelClassName = get_class($modelClassName);
                }
                if (! is_string($modelClassName)) {
                    throw new Exception('For properly relation saving you must provide Model class name (string) or Model instance');
                }
                $element->setModelForOptions($modelClassName);
            } elseif ($forceSaveRelation) {
                if (method_exists($model, $this->getName()) && ($rel = $model->{$this->getName()}()) && ($rel instanceof BelongsToMany || $rel instanceof HasMany)) {
                    $element->setModelForOptions(get_class($rel->getModel()));
                }
            }
        }

        $form = new FormDefault([$element]);

        $array = [];
        Arr::set($array, $this->getName(), $request->input('value', $this->getDefaultValue()));

        $request->merge($array);

        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());

        $form->saveForm($request);

        return $request->input('value', $this->getDefaultValue());
    }

    /**
     * @return mixed
     */
    public function getForceSaveRelation()
    {
        return $this->forceSaveRelation;
    }

    /**
     * @param  bool|Model|callable|null  $forceSaveRelation
     * @return Checklist
     */
    public function setForceSaveRelation($forceSaveRelation = true)
    {
        $this->forceSaveRelation = $forceSaveRelation;

        return $this;
    }
}

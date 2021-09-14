<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Exceptions\Form\Element\SelectException;
use SleepingOwl\Admin\Http\Controllers\FormElementController;

trait SelectAjaxFunctions
{
    protected $search_url = null;
    protected $search = null;
    protected $min_symbols = 3;
    protected $default_query_preparer;

    /**
     * @var array
     */
    protected $params;

    /**
     * @var array
     */
    protected $dataDepends = [];

    /**
     * @var \Closure|null|mixed
     */
    protected $modelForOptionsCallback = null;

    /**
     * @var string|\Closure|mixed
     */
    protected $custom_name = 'custom_name';

    /**
     * @param  string|\Closure|mixed  $custom_name
     * @return $this
     */
    public function setCustomName($custom_name)
    {
        $this->custom_name = $custom_name;

        return $this;
    }

    /**
     * @return string|\Closure|mixed
     */
    public function getCustomName()
    {
        return $this->custom_name;
    }

    /**
     * @return null|string
     */
    public function getSearch()
    {
        if ($this->search) {
            return $this->search;
        }

        return $this->getDisplay();
    }

    /**
     * @param $search
     * @return $this
     */
    public function setSearch($search)
    {
        $this->search = $search;

        return $this;
    }

    /**
     * Get min symbols to search.
     *
     * @return int
     */
    public function getMinSymbols()
    {
        return $this->min_symbols;
    }

    /**
     * Set min symbols to search.
     *
     * @param $symbols
     * @return $this
     */
    public function setMinSymbols($symbols)
    {
        $this->min_symbols = $symbols;

        return $this;
    }

    /**
     * @return array
     */
    public function mutateOptions()
    {
        return $this->getOptions();
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        // get model, model configuration interface, model logic
        $model = $this->getModel();
        $section = \AdminSection::getModel($this->getModel());
        $payload = method_exists($section, 'getPayload') ? $section->getPayload() : [];
        $form_element_controller = new FormElementController();
        $form = $form_element_controller->getModelLogicPayload($section, $model->id, $payload);

        if ($form instanceof FormInterface) {
            // if defined: get values of the depends form fields
            $depends = json_decode($this->getDataDepends(), true);
            if (is_array($depends) && count($depends)) {
                $data_depends = [];
                foreach ($depends as $depend) {
                    $temp_element = $form->getElement($depend);
                    $depend_value = null;
                    if (mb_strpos($depend, '.')) {
                        $parts = explode('.', $depend);
                        $fieldName = array_pop($parts);
                        $relationName = implode('.', $parts);
                        if (! $model->relationLoaded($relationName)) {
                            $model->load($relationName);
                        }
                        $temp = $model;
                        $temp_fail = false;
                        foreach ($parts as $part) {
                            $temp = $temp->{$part};
                            if (! $temp) {
                                $temp_fail = true;
                                break;
                            }
                        }
                        if (! $temp_fail) {
                            $depend_value = $temp->{$fieldName};
                        }
                    } else {
                        $depend_value = $model->{$depend};
                    }
                    if (! $depend_value) {
                        $depend_value = $temp_element->getDefaultValue();
                    }
                    $data_depends[$depend] = $depend_value;
                }
                $this->setAjaxParameters($data_depends);
            }
        }

        // if defined: get model for options via callback
        if (is_callable($callback = $callback = $this->getModelForOptionsCallback())) {
            $result = $callback($this);
            if ($result) {
                $this->setModelForOptions($result);
            }
        }

        if (! is_null($this->getModelForOptions()) && ! is_null($this->getDisplay())) {
            $this->setOptions(
                $this->loadOptions()
            );
        }

        $options = Arr::except($this->options, $this->exclude);
        if ($this->isSortable()) {
            asort($options, $this->getSortableFlags());
        }

        return $options;
    }

    /**
     * @param  string  $key
     * @return bool
     */
    public function hasDependKey($key)
    {
        return Arr::has($this->params, $key);
    }

    /**
     * @param  string  $key
     * @return mixed
     */
    public function getDependValue($key)
    {
        return Arr::get($this->params, $key, $this->getModel()->getAttribute($key));
    }

    /**
     * @return string Json
     */
    public function getDataDepends()
    {
        return json_encode($this->dataDepends);
    }

    /**
     * @return array
     */
    public function getDataDependsArray()
    {
        return $this->dataDepends;
    }

    /**
     * @param  array|string  $depends
     * @return $this
     */
    public function setDataDepends($depends)
    {
        $this->dataDepends = is_array($depends) ? $depends : func_get_args();

        return $this;
    }

    /**
     * @param  array  $params
     * @return $this
     */
    public function setAjaxParameters(array $params)
    {
        $this->params = $params;

        return $this;
    }

    /**
     * @return \Closure
     */
    public function getModelForOptionsCallback()
    {
        return $this->modelForOptionsCallback;
    }

    /**
     * @param  \Closure|null|mixed  $modelForOptionsCallback
     * @return $this
     *
     * @throws SelectException
     */
    public function setModelForOptionsCallback($modelForOptionsCallback)
    {
        if (! is_callable($modelForOptionsCallback) && ! is_null($modelForOptionsCallback)) {
            throw new SelectException('Option for setModelForOptionsCallback must be Closure or null');
        }

        $this->modelForOptionsCallback = $modelForOptionsCallback;

        return $this;
    }
}

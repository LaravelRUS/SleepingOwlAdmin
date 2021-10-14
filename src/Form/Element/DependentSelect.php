<?php

namespace SleepingOwl\Admin\Form\Element;

use AdminSection;
use Illuminate\Routing\Router;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class DependentSelect extends Select implements WithRoutesInterface
{
    /**
     * @var mixed
     */
    protected $defaultValue = 0;

    /**
     * @var string|null
     */
    protected $language;

    /**
     * @var bool
     */
    protected $initializable = true;

    /**
     * @param  Router  $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.form.element.dependent-select';

        if (! $router->has($routeName)) {
            $router->post('{adminModel}/dependent-select/{field}/{id?}', [
                'as' => $routeName,
                'uses' => '\SleepingOwl\Admin\Http\Controllers\FormElementController@dependentSelect',
            ]);
        }
    }

    /**
     * @var string
     */
    protected $dataUrl = '';

    /**
     * @var array
     */
    protected $dataDepends = [];

    /**
     * @var array
     */
    protected $params;

    /**
     * @var string
     */
    protected $view = 'form.element.dependentselect';

    /**
     * DependentSelect constructor.
     *
     * @param $path
     * @param  null  $label
     * @param  array  $depends
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     */
    public function __construct($path, $label = null, array $depends = [])
    {
        parent::__construct($path, $label, []);

        $this->setLanguage(config('app.locale'));
        $this->setDataDepends($depends);
    }

    /**
     * @return string|null
     */
    public function getLanguage()
    {
        return $this->language;
    }

    /**
     * @param $language
     * @return $this
     */
    public function setLanguage($language)
    {
        $this->language = $language;

        return $this;
    }

    /**
     * @return bool
     */
    public function isInitializable()
    {
        return $this->initializable;
    }

    /**
     * @param  bool  $initializable
     */
    public function setInitializable($initializable)
    {
        $this->initializable = $initializable;

        return $this;
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
     * @return string
     */
    public function getDataUrl()
    {
        return $this->dataUrl ?: route('admin.form.element.dependent-select', [
            'adminModel' => AdminSection::getModel($this->model)->getAlias(),
            'field' => $this->getName(),
            'id' => $this->model->getKey(),
        ], false);
    }

    /**
     * @param  string  $dataUrl
     * @return $this
     */
    public function setDataUrl($dataUrl)
    {
        $this->dataUrl = $dataUrl;

        return $this;
    }

    /**
     * @return string Json
     */
    public function getDataDepends()
    {
        return json_encode($this->dataDepends);
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
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'id' => $this->getId(),
            'data-select-type' => 'single',
            'data-url' => $this->getDataUrl(),
            'data-depends' => $this->getDataDepends(),
            'data-language' => $this->getLanguage(),
            'data-initialize' => $this->isInitializable() ? 'true' : 'false',
            'class' => 'form-control input-select input-select-dependent',
        ]);

        if ($this->isReadonly()) {
            $this->setHtmlAttribute('disabled', 'disabled');
        }

        $options = $this->getOptions();

        if ($this->isNullable()) {
            $options = [null => trans('sleeping_owl::lang.select.nothing')] + $options;
        }

        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'path' => $this->getPath(),
            'label' => $this->getLabel(),
            'readonly' => $this->isReadonly(),
            'visibled' => $this->isVisible(),
            'options' => $options,
            'value' => $this->getValueFromModel(),
            'helpText' => $this->getHelpText(),
            'required' => in_array('required', $this->validationRules),
            'attributes' => $this->getHtmlAttributes(),
        ];
    }
}

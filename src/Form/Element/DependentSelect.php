<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Http\JsonResponse;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class DependentSelect extends Select implements WithRoutesInterface
{
    /**
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.form.element.dependent-select';

        if (! $router->has($routeName)) {
            $router->post('{adminModel}/dependent-select/{field}/{id?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\FormElementController@dependentSelect'
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
     * @param string $path
     * @param null $label
     * @param array $depends
     */
    public function __construct($path, $label = null, array $depends = [])
    {
        parent::__construct($path, $label, []);

        $this->setDataDepends($depends);
    }

    /**
     * @param string $key
     *
     * @return bool
     */
    public function hasDependKey($key)
    {
        return array_has($this->params, $key);
    }

    /**
     * @param string $key
     *
     * @return mixed
     */
    public function getDependValue($key)
    {
        return array_get($this->params, $key, $this->getModel()->getAttribute($key));
    }

    /**
     * @return string
     */
    public function getDataUrl()
    {
        return $this->dataUrl ?: route('admin.form.element.dependent-select', [
            'adminModel' => \AdminSection::getModel($this->model)->getAlias(),
            'field' => $this->getName(),
            'id' => $this->model->getKey(),
        ]);
    }

    /**
     * @param string $dataUrl
     *
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
     * @param array|string $depends
     *
     * @return $this
     */
    public function setDataDepends($depends)
    {
        $this->dataDepends = is_array($depends) ? $depends : func_get_args();

        return $this;
    }

    /**
     * @param array $params
     *
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
        $attributes = [
            'id' => $this->getName(),
            'size' => 2,
            'data-select-type' => 'single',
            'data-url' => $this->getDataUrl(),
            'data-depends' => $this->getDataDepends(),
            'class' => 'form-control input-select input-select-dependent',
        ];

        if ($this->isReadonly()) {
            $attributes['disabled'] = 'disabled';
        }

        return [
            'id' => $this->getName(),
            'name' => $this->getName(),
            'path' => $this->getPath(),
            'label' => $this->getLabel(),
            'readonly' => $this->isReadonly(),
            'options' => $this->getOptions(),
            'value' => $this->getValueFromModel(),
            'helpText' => $this->getHelpText(),
            'required' => in_array('required', $this->validationRules),
            'attributes' => $attributes,
        ];
    }
}

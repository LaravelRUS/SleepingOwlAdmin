<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class MultiSelectAjax extends MultiSelect implements Initializable, WithRoutesInterface
{
    protected $view = 'form.element.selectajax';

    protected static $route = 'multiselectajax';

    protected $search_url = null;

    /**
     * MultiSelectAjax constructor.
     * @param string $path
     * @param null $label
     * @param array $options
     */
    public function __construct($path, $label = null, $options = [])
    {
        parent::__construct($path, $label, $options);

        $this->setLoadOptionsQueryPreparer(function ($item, $query) {
            $repository = app(RepositoryInterface::class);
            $repository->setModel($this->getModelForOptions());
            $key = $repository->getModel()->getKeyName();

            return $query->whereIn($key, $this->getValueFromModel() ? $this->getValueFromModel() : []);
        });
    }

    /**
     * Search url for ajax.
     * @param $url
     */
    public function setSearchUrl($url)
    {
        $this->search_url = $url;
    }

    /**
     * Getter of search url.
     * @return string
     */
    public function getSearchUrl()
    {
        return $this->search_url ? $this->search_url : route('admin.form.element.'.static::$route, [
                'adminModel' => \AdminSection::getModel($this->model)->getAlias(),
                'field'      => $this->getName(),
                'id'         => $this->model->getKey(),
            ]);
    }

    /**
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.form.element.'.static::$route;

        if (! $router->has($routeName)) {
            $router->post('{adminModel}/'.static::$route.'/{field}/{id?}', [
                'as'   => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\FormElementController@multiselectSearch',
            ]);
        }
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $attributes = [
            'id'         => $this->getName(),
            'class'      => 'form-control js-data-ajax',
            'multiple',
            'field'      => $this->display,
            'model'      => get_class($this->getModelForOptions()),
            'search_url' => $this->getSearchUrl(),
        ];

        return ['attributes' => $attributes] + parent::toArray();
    }

    /**
     * @param Request $request
     *
     * @return void
     */
    public function afterSave(Request $request)
    {
        $attribute = $this->getModelAttributeKey();

        if (! method_exists($this->getModel(), $attribute)) {
            return;
        }

        parent::afterSave($request);
    }
}

<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Routing\Router;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;

class SelectAjax extends Select implements Initializable, WithRoutesInterface
{
    protected static $route = 'selectajax';
    protected $view = 'form.element.selectajax';
    protected $search_url = null;

    /**
     * @param string $path
     * @param string|null $label
     * @param array|Model $options
     */
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        $this->setLoadOptionsQueryPreparer(function ($item, $query) {
            $repository = app(RepositoryInterface::class);
            $repository->setModel($this->getModelForOptions());
            $key = $repository->getModel()->getKeyName();

            return $query->where([$key => $this->getValueFromModel()]);
        });
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
                'uses' => 'SleepingOwl\Admin\Http\Controllers\FormElementController@selectSearch',
            ]);
        }
    }

    /**
     * @param $url
     */
    public function setSearchUrl($url)
    {
        $this->search_url = $url;

        return $this;
    }

    /**
     * @return string
     */
    public function getSearchUrl()
    {
        return $this->search_url ? $this->search_url : route('admin.form.element.'.static::$route, [
                'adminModel' => \AdminSection::getModel($this->model)->getAlias(),
                'field' => $this->getName(),
                'id' => $this->model->getKey(),
            ]);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $attributes = [
            'id'               => $this->getName(),
            'size'             => 2,
            'data-select-type' => 'single',
            'class'            => 'form-control js-data-ajax',
            'model'            => get_class($this->getModelForOptions()),
            'field'            => $this->getDisplay(),
            'search_url'       => $this->getSearchUrl(),
        ];

        return ['attributes' => $attributes] + parent::toArray();
    }
}

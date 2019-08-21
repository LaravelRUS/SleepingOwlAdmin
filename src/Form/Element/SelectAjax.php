<?php

namespace SleepingOwl\Admin\Form\Element;

use AdminSection;
use Illuminate\Routing\Router;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Traits\SelectAjaxFunctions;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;

class SelectAjax extends Select implements Initializable, WithRoutesInterface
{
    use SelectAjaxFunctions;

    protected static $route = 'selectajax';
    protected $view = 'form.element.selectajax';

    /**
     * SelectAjax constructor.
     * @param $path
     * @param null $label
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     */
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        /*
        // This code add closure, that modify query so, that select will have only one value.
        // This feature need for optimized selectajax initiation for also existing records.
        // Make some changes for availability to use setLoadOptionsQueryPreparer() in Sections.
        $this->setLoadOptionsQueryPreparer(function ($item, Builder $query) {
            $repository = app(RepositoryInterface::class);
            $repository->setModel($this->getModelForOptions());
            $key = $repository->getModel()->getKeyName();

            $return = $query->where([$key => $this->getValueFromModel()]);
            #dd($return->toSql());
            return $return;
        });
        */

        $this->default_query_preparer = function ($item, Builder $query) {
            $repository = app(RepositoryInterface::class);
            $repository->setModel($this->getModelForOptions());
            $key = $repository->getModel()->getKeyName();

            return $query->where([$key => $this->getValueFromModel()]);
        };
    }

    /**
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.form.element.'.static::$route;

        if (! $router->has($routeName)) {
            $router->post('{adminModel}/'.static::$route.'/{field}/{id?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\FormElementController@selectSearch',
            ]);
        }
    }

    /**
     * Getter of search url.
     * @return string
     */
    public function getSearchUrl()
    {
        return $this->search_url ? $this->search_url : route('admin.form.element.'.static::$route, [
            'adminModel' => AdminSection::getModel($this->model)->getAlias(),
            'field' => $this->getName(),
            'id' => $this->model->getKey(),
        ]);
    }

    /**
     * Search url for ajax.
     * @param $url
     * @return $this
     */
    public function setSearchUrl($url)
    {
        $this->search_url = $url;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setLoadOptionsQueryPreparer($this->default_query_preparer);

        $this->setHtmlAttributes([
            'id' => $this->getName(),
            'class' => 'form-control js-data-ajax',
            'data-select-type' => 'single',
            'model' => get_class($this->getModelForOptions()),
            //'field' => $this->getDisplay(),
            'search' => $this->getSearch(),
            'search_url' => $this->getSearchUrl(),
            'data-min-symbols' => $this->getMinSymbols(),
        ]);

        return ['attributes' => $this->getHtmlAttributes()] + parent::toArray();
    }
}

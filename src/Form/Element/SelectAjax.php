<?php

namespace SleepingOwl\Admin\Form\Element;

use AdminSection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Routing\Router;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Traits\SelectAjaxFunctions;

class SelectAjax extends Select implements Initializable, WithRoutesInterface
{
    use SelectAjaxFunctions;

    protected static $route = 'selectajax';
    protected $view = 'form.element.selectajax';

    /**
     * @var string|null
     */
    protected $language;

    /**
     * SelectAjax constructor.
     *
     * @param $path
     * @param  null  $label
     *
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
            return $return;
        });
        */

        $this->default_query_preparer = function (self $item, Builder $query) {
            $repository = app(RepositoryInterface::class);
            $repository->setModel($this->getModelForOptions());
            $key = $repository->getModel()->getKeyName();

            if (null != ($value_from_model = $this->getValueFromModel())) {
                return $query->where([$key => $value_from_model]);
            } elseif (null != ($value = $item->getValue())) {
                return $query->where([$key => $value]);
            } elseif (null != ($default_value = $item->getDefaultValue())) {
                return $query->where([$key => $default_value]);
            }

            return $query->where([$key => null]);
        };

        $this->setLanguage(config('app.locale'));
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
     * @param  Router  $router
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
     *
     * @return string
     */
    public function getSearchUrl()
    {
        return $this->search_url ? $this->search_url : route('admin.form.element.'.static::$route, [
            'adminModel' => AdminSection::getModel($this->model)->getAlias(),
            'field' => $this->getPath() ?: $this->getName(),
            'id' => $this->model->getKey(),
        ], false);
    }

    /**
     * Search url for ajax.
     *
     * @param $url
     * @return $this
     */
    public function setSearchUrl($url)
    {
        $this->search_url = $url;

        return $this;
    }

    /**
     * Set select can be reseted.
     *
     * @return $this
     */
    public function allowClear()
    {
        $this->setHtmlAttribute('data-allow-clear', 'true');

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setLoadOptionsQueryPreparer($this->default_query_preparer);

        $this->setHtmlAttributes([
            'id' => $this->getId(),
            'class' => 'form-control js-data-ajax',
            'data-select-type' => 'single',
            'data-language' => $this->getLanguage(),
            //'model' => get_class($this->getModelForOptions()),
            //'field' => $this->getDisplay(),
            //'search' => $this->getSearch(),
            'search_url' => $this->getSearchUrl(),
            'disabled' => $this->readonly,
            'data-min-symbols' => $this->getMinSymbols(),
        ]);

        if (count($this->getDataDependsArray())) {
            $depends = $this->getDataDependsArray();
            $depends = array_map(function ($el) {
                return strtr($el, ['.' => '__']);
            }, $depends);
            $depends = json_encode($depends);

            $this->setHtmlAttributes([
                'data-language' => $this->getLanguage(),
                'data-depends' => $depends,
                'data-url' => $this->getSearchUrl(),
                'class' => 'input-select input-select-dependent',
            ]);
        }

        return ['attributes' => $this->getHtmlAttributes()] + parent::toArray();
    }
}

<?php

namespace SleepingOwl\Admin\Form\Element;

use AdminSection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Traits\SelectAjaxFunctions;

class MultiSelectAjax extends MultiSelect implements Initializable, WithRoutesInterface
{
    use SelectAjaxFunctions;

    protected static $route = 'multiselectajax';
    protected $view = 'form.element.selectajax';

    /**
     * @var string|null
     */
    protected $language;

    /**
     * MultiSelectAjax constructor.
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

            return $query->whereIn($key, $this->getValueFromModel() ? $this->getValueFromModel() : []);
        });
        */

        $this->default_query_preparer = function (self $item, Builder $query) {
            $repository = app(RepositoryInterface::class);
            $repository->setModel($this->getModelForOptions());
            $key = $repository->getModel()->getKeyName();

            if (null != ($value_from_model = $this->getValueFromModel()) && is_array($value_from_model) && count($value_from_model)) {
                return $query->whereIn($key, $value_from_model);
            } elseif (null != ($value = $item->getValue()) && is_array($value) && count($value)) {
                return $query->whereIn($key, $value);
            } elseif (null != ($default_value = $item->getDefaultValue()) && is_array($default_value) && count($default_value)) {
                return $query->whereIn($key, $default_value);
            }

            return $query->whereIn($key, []);
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
                'uses' => 'SleepingOwl\Admin\Http\Controllers\FormElementController@multiselectSearch',
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
            'field' => $this->getPath() ?: $this->getFieldName(),
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
     * @return array
     */
    public function toArray()
    {
        $this->setLoadOptionsQueryPreparer($this->default_query_preparer);

        $this->setHtmlAttributes([
            'id' => $this->getId(),
            'class' => 'form-control js-data-ajax',
            'multiple',
            //'model' => get_class($this->getModelForOptions()),
            //'field' => $this->getDisplay(),
            //'search' => $this->getSearch(),
            'search_url' => $this->getSearchUrl(),
            'data-min-symbols' => $this->getMinSymbols(),
        ]);

        if ($this->getDataDepends() != '[]') {
            $this->setHtmlAttributes([
                'data-language' => $this->getLanguage(),
                'data-depends' => $this->getDataDepends(),
                'data-url' => $this->getSearchUrl(),
                'class' => 'input-select input-select-dependent',
            ]);
        }

        return ['attributes' => $this->getHtmlAttributes()] + parent::toArray();
    }

    /**
     * Get Field name for search url.
     *
     * @return mixed
     */
    public function getFieldName()
    {
        return str_replace('[]', '', $this->getName());
    }

    /**
     * @return array
     */
    protected function loadOptions()
    {
        $repository = app(RepositoryInterface::class);
        $repository->setModel($this->getModelForOptions());
        $key = $repository->getModel()->getKeyName();

        $options = $repository->getQuery();
        $relation = $this->getModelAttributeKey();

        if ($this->isEmptyRelation() && ! is_null($foreignKey = $this->getForeignKey())) {
            $model = $this->getModel();

            if ($model->{$relation}() instanceof HasOneOrMany) {
                $options->where($foreignKey, 0)->orWhereNull($foreignKey);
            }
        }

        if (count($this->getFetchColumns()) > 0) {
            $options->select(
                array_merge([$key], $this->getFetchColumns())
            );
        }

        // call the pre load options query preparer if has be set
        if (! is_null($preparer = $this->getLoadOptionsQueryPreparer())) {
            $options = $preparer($this, $options);
        }

        if (method_exists($this->getModel(), $relation) && $this->getModel()->{$relation}() instanceof BelongsToMany) {
            $options = $this->getModel()->{$relation}();
        }

        $options = $options->get();

        if (is_callable($makeDisplay = $this->getDisplay())) {
            // make dynamic display text
            if ($options instanceof Collection) {
                $options = $options->all();
            }

            // iterate for all options and redefine it as
            // list of KEY and TEXT pair
            $options = array_map(function ($opt) use ($key, $makeDisplay) {
                // get the KEY and make the display text
                return [data_get($opt, $key), $makeDisplay($opt)];
            }, $options);

            // take options as array with KEY => VALUE pair
            $options = Arr::pluck($options, 1, 0);
        } elseif ($options instanceof Collection) {
            // take options as array with KEY => VALUE pair
            $options = Arr::pluck($options->all(), $this->getDisplay(), $key);
        } else {
            // take options as array with KEY => VALUE pair
            $options = Arr::pluck($options, $this->getDisplay(), $key);
        }

        return $options;
    }

    /**
     * @param  Request  $request
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

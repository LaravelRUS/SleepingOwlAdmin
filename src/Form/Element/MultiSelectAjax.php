<?php

namespace SleepingOwl\Admin\Form\Element;

use AdminSection;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;

class MultiSelectAjax extends MultiSelect implements Initializable, WithRoutesInterface
{
    protected $view = 'form.element.selectajax';

    protected static $route = 'multiselectajax';

    protected $search_url = null;

    protected $min_symbols = 3;

    protected $search = null;

    /**
     * MultiSelectAjax constructor.
     * @param string $path
     * @param null $label
     */
    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        $this->setLoadOptionsQueryPreparer(function ($item, Builder $query) {
            $repository = app(RepositoryInterface::class);
            $repository->setModel($this->getModelForOptions());
            $key = $repository->getModel()->getKeyName();

            return $query->whereIn($key, $this->getValueFromModel() ? $this->getValueFromModel() : []);
        });
    }

    /**
     * @return null
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
     * Get Field name for search url.
     * @return mixed
     */
    public function getFieldName()
    {
        return str_replace('[]', '', $this->getName());
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
     * Getter of search url.
     * @return string
     */
    public function getSearchUrl()
    {
        return $this->search_url ? $this->search_url : route('admin.form.element.'.static::$route, [
            'adminModel' => AdminSection::getModel($this->model)->getAlias(),
            'field'      => $this->getFieldName(),
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
     * Set min symbols to search.
     * @param $symbols
     * @return $this
     */
    public function setMinSymbols($symbols)
    {
        $this->min_symbols = $symbols;

        return $this;
    }

    /**
     * Get min symbols to search.
     * @return int
     */
    public function getMinSymbols()
    {
        return $this->min_symbols;
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
    public function toArray()
    {
        $this->setHtmlAttributes([
            'id'               => $this->getName(),
            'class'            => 'form-control js-data-ajax',
            'multiple',
            'field'            => $this->getDisplay(),
            'search'           => $this->getSearch(),
            'model'            => get_class($this->getModelForOptions()),
            'search_url'       => $this->getSearchUrl(),
            'data-min-symbols' => $this->getMinSymbols(),
        ]);

        return ['attributes' => $this->getHtmlAttributes()] + parent::toArray();
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
            $options = array_pluck($options, 1, 0);
        } elseif ($options instanceof Collection) {
            // take options as array with KEY => VALUE pair
            $options = array_pluck($options->all(), $this->getDisplay(), $key);
        } else {
            // take options as array with KEY => VALUE pair
            $options = array_pluck($options, $this->getDisplay(), $key);
        }

        return $options;
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

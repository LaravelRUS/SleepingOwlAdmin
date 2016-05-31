<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\Form\Element\SelectException;

class Select extends NamedFormElement
{
    /**
     * @var Model
     */
    protected $modelForOptions;

    /**
     * @var string
     */
    protected $display = 'title';

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var bool
     */
    protected $nullable = false;

    /**
     * @var bool
     */
    protected $sortable = true;

    /**
     * @var bool
     */
    protected $isEmptyRelation = false;

    /**
     * @var array
     */
    protected $exclude = [];

    /**
     * @var string|null
     */
    protected $foreignKey = null;

    /**
     * @var array
     */
    protected $fetchColumns = [];


    /**
     * @var function|\Closure|object callable
     */
    protected $loadOptionsQueryPreparer;

    /**
     * @var bool
     */
    protected $dynamic = false;

    /**
     * @var array
     */
    protected $dynamicOptions = [];

    /**
     * @var array
     */
    protected $widgetAttributes = [];

    /**
     * @param string      $path
     * @param string|null $label
     * @param array|Model $options
     */
    public function __construct($path, $label = null, $options = [])
    {
        parent::__construct($path, $label);

        if (is_array($options)) {
            $this->setOptions($options);
        } elseif (($options instanceof Model) or is_string($options)) {
            $this->setModelForOptions($options);
        }
    }

    /**
     * @return Model
     */
    public function getModelForOptions()
    {
        return $this->modelForOptions;
    }

    /**
     * @param @param string|Model $modelForOptions
     *
     * @return $this
     * @throws SelectException
     */
    public function setModelForOptions($modelForOptions)
    {
        if (is_string($modelForOptions)) {
            $modelForOptions = app($modelForOptions);
        }

        if (! ($modelForOptions instanceof Model)) {
            throw new SelectException('Class must be instanced of Illuminate\Database\Eloquent\Model');
        }

        $this->modelForOptions = $modelForOptions;

        return $this;
    }

    /**
     * @return string
     */
    public function getDisplay()
    {
        return $this->display;
    }

    /**
     * @param string $display
     *
     * @return $this
     */
    public function setDisplay($display)
    {
        $this->display = $display;

        return $this;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        if (! is_null($this->getModelForOptions())
            && ! is_null($this->getDisplay())) {
            $this->loadOptions();
        }

        $options = $this->options;

        if ($this->isSortable()) {
            asort($options);
        }

        return $options;
    }

    /**
     * @param array
     *
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @param array $values
     *
     * @return $this
     */
    public function setEnum(array $values)
    {
        return $this->setOptions(array_combine($values, $values));
    }

    /**
     * @return bool
     */
    public function isNullable()
    {
        return $this->nullable;
    }

    /**
     * @return $this
     */
    public function nullable()
    {
        $this->nullable = true;

        return $this;
    }

    /**
     * @return $this
     */
    public function onlyEmptyRelation()
    {
        $this->isEmptyRelation = true;

        return $this;
    }

    /**
     * @return bool
     */
    public function isEmptyRelation()
    {
        return $this->isEmptyRelation;
    }

    /**
     * @param bool $sortable
     *
     * @return $this
     */
    public function setSortable($sortable)
    {
        $this->sortable = (bool) $sortable;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSortable()
    {
        return $this->sortable;
    }

    /**
     * Set Only fetch columns.
     *
     * If use {@link Select#setModelForOptions($model)}, on fetch
     * data from the $model table, only specified columns has be
     * feched.
     *
     * Examples: <code>setFetchColumns('title')</code> or
     * <code>setFetchColumns(['title'])</code> or
     * <code>setFetchColumns('title', 'position')</code> or
     * <code>setFetchColumns(['title', 'position'])</code>.
     *
     * @param string|array $columns
     * @return $this
     */
    public function setFetchColumns($columns)
    {
        if (! is_array($columns)) {
            $columns = func_get_args();
        }

        $this->fetchColumns = $columns;

        return $this;
    }

    /**
     * Get the fetch columns.
     *
     * @return array
     */
    public function getFetchColumns()
    {
        return $this->fetchColumns;
    }

    /**
     * Set Callback for prepare load options Query.
     *
     * Example:
     * <code>
     * <?php
     * AdminFormElement::select('column', 'Label')
     *     ->modelForOptions(MyModel::class)
     *     ->setLoadOptionsQueryPreparer(function($item, QueryBuilder $query) {
     *         return $query
     *             ->where('column', 'value')
     *             ->were('owner_id', Auth::user()->id)
     *     });
     * ?>
     * </code>
     *
     * @param callable $callback The Callback with $item and $options args.
     * @return $this
     */
    public function setLoadOptionsQueryPreparer($callback)
    {
        $this->loadOptionsQueryPreparer = $callback;

        return $this;
    }

    /**
     * Get Callback for prepare load options Query.
     * @return callable
     */
    public function getLoadOptionsQueryPreparer()
    {
        return $this->loadOptionsQueryPreparer;
    }

    /**
     * Set Widget Attributtes.
     *
     * Set Attributes for customize the widget.
     * Default widget is Select2.
     *
     * Available attributes for Select2:
     * - options (array): Custom options.
     * - customizeOptions (string): JavaScript function for customize options
     *   dynamically. Example "`winVar.attr`".
     *
     * @see https://select2.github.io
     * @param array $attributes the attributes
     * @return Select
     */
    public function setWidgetAttributes(array $attributes, $update = false)
    {
        if (! $update) {
            $this->widgetAttributes = [];
        }

        $this->widgetAttributes = array_merge($this->widgetAttributes, $attributes);

        return $this;
    }

    /**
     * Set specific widget attribute.
     *
     * @see Select::setWidgetAttributes
     * @param $attName The Attribute name
     * @param $value The value
     * @return $this
     */
    public function setWidgetAttribute($attName, $value)
    {
        $this->widgetAttributes[$attName] = $value;

        return $this;
    }

    /**
     * @return array
     */
    public function getWidgetAttributes()
    {
        return $this->widgetAttributes;
    }

    /**
     * @return boolean
     */
    public function isDynamic()
    {
        return $this->dynamic;
    }

    /**
     * @param boolean $dynamic
     * @return Select
     */
    public function setDynamic($dynamic)
    {
        $this->dynamic = $dynamic;

        return $this;
    }

    /**
     * Shortcut for set as dynamic and set dynamic options.
     *
     * Is shortcut of:
     *
     * ```php
     * $item->setDynamic(true);
     * $item->setDynamicOptions($options);
     * ```
     *
     * @param array|null $options Optional. The dynamic options.
     * @see Select::setDynamic()
     * @see Select::setDynamicOptions()
     * @return Select
     */
    public function dynamic($options = null)
    {
        if (! is_null($options)) {
            $this->setDynamicOptions($options);
        }

        return $this->setDynamic(true);
    }

    /**
     * Set the dynamic options.
     *
     * For use dynamically data, set `$options['url']` or `$options['static']`.
     * If the `$options` keys *url* or *static* are not defined, all other
     * options are ignored. If `$options['url']` *AND* `$options['static']` are set,
     * only the `$options['static']` will be accepted.
     *
     * The available options:
     *
     * @param array $options {
     *      An array of dynamic options.
     *
     *      @type string $url URL for remote data source.
     *      @type string $findByIdUrl URL for find by id. To recover using the
     *                               options through the unique identification.
     *                               For example on the edit form where only was
     *                               stored the ID (or primary key) as the field
     *                               value. Default is a **$url** option.
     *      @type string $idParam The request param name for pass ID on using
     *                            the $findByIdUrl. Default is `'id'`. Multiple
     *                            values are concatenated and separated by
     *                             **$idParamSep** option.
     *      @type string $idParamSep Character used to separate multiple values
     *                               passed in parameter **$idParam**.
     *      @type int $minInputLength Minimum input length on search term input
     *                                field for fetch remote options.
     *      @type null|array|string $static Set the Static JavaScript data
     *                                      source.
     *
     *                                      Examples:
     *
     *                                      - array: `[
     *                                        ["id" => 1, "text" => "One"],
     *                                        ["id" => 2, "text" => "Two"]
     *                                        ]`.
     *
     *                                      - string: `globalObj.pname`, the
     *                                        JavaScript code on page:
     *                                        `window.globalObj = {pname:
     *                                        [{id: 1, text: "One"},
     *                                        {id: 2, text: "Two"}}`.
     *
     *      @type bool $cache If store the ajax response data into cache.
     *                        Default is `false`.
     *      @type int $pageSize Number of items per page. Default is `30`.
     *      @type int $minInputLength Minimum number of characters in search box
     *                               for load remote data. Default is `2`.
     *      @type string $itemsProperty Name of items property in remote data
     *                                  response. Example: `'items'` or
     *                                  `'items.data'`.
     *      @type string $totalCountProperty Name of total results count property
     *                                       in remote data response. Example:
     *                                       `'items'` or `'items.data'`.
     *      @type array $dependency An array of the dependency fields or QUEY
     *                              STRING of page URL. If item in array is a
     *                              KEY and VALUE pair, the KEY is a remote
     *                              data name, and VALUE is a VALUE GETTER,
     *                              otherwise the VALUE is a VALUE GETTER and
     *                              the remote data name.
     *
     *                              Examples:
     *
     *                              - `["dataName"]`: Remote data name is
     *                                `dataName` and the value is obtained by
     *                                `$self.closest('form').find("#dataname")
     *                                .val()`.
     *
     *                              - `["dataName" => "elid" ]`: Remote data
     *                                name is `dataName` and the value is
     *                                obtained by `$self.closest('form').
     *                                find("#elid").val()`.
     *
     *                              - `["dataName" => "~elid" ]`: Remote data
     *                                name is `dataName` and the value is
     *                                obtained by `$self.closest('form')
     *                                .find("elid").val()`.
     *
     *                              - `["dataName" => "~.thebox:first" ]`:
     *                                Remote data name is `dataName` and the
     *                                value is obtained by `$self
     *                                .closest('form').find(".thebox:first")
     *                                .val()`.
     *
     *                              - `["dataName" => "@qname" ]`: Remote data
     *                                name is `dataName` and the value is
     *                                obtained by `jQuery.url.param("qname")`.
     *
     *      @type int $delay Milliseconds for wait before triggering the
     *                       request data. Default is `500`.
     *      @type string $pageParam Name of page parameter. Default is `'page'`.
     *      @type string $termParam Name of search term parameter.
     *                              Default is `'q'`.
     *      @type array $params Array of custom parameters.
     * }
     * @param bool $merge Optional. If merge the $options on current options.
     *                    Default is `false`.
     * @return Select
     */
    public function setDynamicOptions(array $options, $merge = false)
    {
        $this->dynamicOptions = $options;

        return $this;
    }

    /**
     * Set specific dynamic option.
     *
     * @see Select::setDynamicOptions
     * @param $attName The Option name
     * @param $value The value
     * @return $this
     */
    public function setDynamicOption($attName, $value)
    {
        $this->dynamicOptions[$attName] = $value;

        return $this;
    }


    /**
     * @return array
     */
    public function getDynamicOptions()
    {
        return $this->dynamicOptions;
    }

    /**
     * @param array $keys
     *
     * @return $this
     */
    public function exclude($keys)
    {
        if (! is_array($keys)) {
            $keys = func_get_args();
        }

        $this->exclude = array_filter($keys);

        return $this;
    }

    /**
     * @return null|string
     */
    public function getForeignKey()
    {
        if (is_null($this->foreignKey)) {
            return $this->foreignKey = $this->getModel()->getForeignKey();
        }

        return $this->foreignKey;
    }

    /**
     * @param null|string $foreignKey
     *
     * @return $this
     */
    public function setForeignKey($foreignKey)
    {
        $this->foreignKey = $foreignKey;

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
            'class' => 'form-control input-select',
        ];

        if ($this->isNullable()) {
            $attributes['data-nullable'] = 'true';
        }

        $options = [];

        if ($this->isDynamic()) {
            $attributes['data-dynamic'] = 'true';

            $dynamicOptions = $this->getDynamicOptions();
            $dynamicOptions['value'] = $this->getValue();

            if (! is_null($modelForOptions = $this->getModelForOptions())
                && empty($dynamicOptions['url'])
                && empty($dynamicOptions['static'])) {
                $dynamicOptions['url'] = route('admin.model.dataProvider', [
                    'adminModel' => app('sleeping_owl')
                        ->getModel($modelForOptions)
                        ->getAlias()
                ]);

                if (! array_key_exists('params', $dynamicOptions)) {
                    $dynamicOptions['params'] = [];
                }

                if (empty($dynamicOptions['_dp.format'])) {
                    $dynamicOptions['params']['_dp.format'] = 'idtext';
                }
            }

            if (! empty($dynamicOptions)) {
                $attributes['data-dynamic-options'] = json_encode($dynamicOptions);
            }
        } else if ($this->isNullable()) {
            $options = [null => trans('sleeping_owl::lang.select.nothing')];
        }

        if (! empty($widgetAttributes = $this->getWidgetAttributes())) {
            $attributes['data-widget-options'] = json_encode($widgetAttributes);
        }

        if (! $this->isDynamic()) {
            $options = $options + $this->getOptions();
            $options = array_except($options, $this->exclude);
        }

        return parent::toArray() + [
            'options' => $options,
            'nullable' => $this->isNullable(),
            'attributes' => $attributes,
        ];
    }

    /**
     * @var RepositoryInterface
     */
    protected function loadOptions()
    {
        $repository = app(RepositoryInterface::class, [$this->getModelForOptions()]);

        $key = $repository->getModel()->getKeyName();

        $options = $repository->getQuery();

        if ($this->isEmptyRelation()) {
            $options->where($this->getForeignKey(), 0)->orWhereNull($this->getForeignKey());
        }

        if (count($this->fetchColumns) > 0) {
            $columns = array_merge([$key], $this->fetchColumns);
            $options->select($columns);
        }

        // call the pre load options query preparer if has be set
        if (! is_null($preparer = $this->getLoadOptionsQueryPreparer())) {
            $options = $preparer($this, $options);
        }

        $options = $options->get();

        if (is_callable($this->getDisplay())) {
            // make dynamic display text
            if ($options instanceof Collection) {
                $options = $options->all();
            }

            // the maker
            $makeDisplay = $this->getDisplay();

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

        $this->setOptions($options);
    }

    /**
     * @param mixed $value
     *
     * @return mixed
     */
    protected function prepareValue($value)
    {
        if ($this->isNullable() and $value == '') {
            return;
        }

        return $value;
    }
}

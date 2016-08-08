<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Exceptions\Form\Element\SelectException;
use SleepingOwl\Admin\Factories\RepositoryFactory;
use Symfony\Component\Translation\TranslatorInterface;

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
     * @var callable|\Closure|object callable
     */
    protected $loadOptionsQueryPreparer;

    /**
     * @var RepositoryFactory
     */
    protected $repositoryFactory;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @param string $path
     * @param string|null $label
     * @param array|Model $options
     * @param TemplateInterface $template
     * @param Package $package
     * @param Request $request
     * @param RepositoryFactory $repositoryFactory
     * @param TranslatorInterface $translator
     */
    public function __construct($path,
                                $label,
                                $options,
                                TemplateInterface $template,
                                Package $package,
                                Request $request,
                                RepositoryFactory $repositoryFactory,
                                TranslatorInterface $translator)
    {
        parent::__construct($path, $label, $template, $package, $request);

        $this->translator = $translator;
        $this->repositoryFactory = $repositoryFactory;

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
            $modelForOptions = new $modelForOptions;
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
        if (! is_null($this->getModelForOptions()) && ! is_null($this->getDisplay())) {
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

        if ($this->isReadonly()) {
            $attributes['disabled'] = 'disabled';
        }

        if ($this->isNullable()) {
            $attributes['data-nullable'] = 'true';
        }

        $options = $this->getOptions();

        if ($this->isNullable()) {
            $options = [null => $this->translator->trans('sleeping_owl::lang.select.nothing')] + $options;
        }

        $options = array_except($options, $this->exclude);

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
        $repository = $this->repositoryFactory->make($this->getModelForOptions());

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

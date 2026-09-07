<?php

namespace SleepingOwl\Admin\Display\Column\Editable\Concerns;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use InvalidArgumentException;
use SleepingOwl\Admin\Contracts\Display\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\WithModelInterface;
use SleepingOwl\Admin\Display\Column\OrderByClause;
use SleepingOwl\Admin\Traits\SmallDisplay;
use SleepingOwl\Admin\Traits\Visibled;
use Throwable;

trait InteractsWithEditableColumn
{
    use SmallDisplay, Visibled;

    protected $readonlyEditable = false;

    protected $url;

    protected $title;

    protected $editableMode = 'popup';

    protected $modifier;

    protected $searchCallback;

    protected $orderCallback;

    protected $filterCallback;

    protected $columMetaClass;

    protected $header;

    protected $append;

    protected $width;

    protected $orderByClause;

    protected $isSearchable = false;

    protected $orderable = true;

    protected $resolvedVisibility;

    protected function initializeEditableColumn($label = null, $small = null): void
    {
        $this->header = app(TableHeaderColumnInterface::class);
        $this->setName($this->getPath());

        if (! is_null($label)) {
            $this->setLabel($label);
        }

        if ($small) {
            $this->setSmall($small);
        }

        // Form-control attributes belong to the editor template, while these
        // attributes belong to the table cell wrapper.
        $this->clearHtmlAttributes();

        if ($this->orderable) {
            $this->setOrderable();
        }
    }

    public function initialize()
    {
        $this->includePackage();
    }

    public function setLabel($title)
    {
        $this->label = $title;
        $this->header?->setTitle($title);

        return $this;
    }

    public function getModelValue()
    {
        return $this->getValueFromObject($this->getModel(), $this->getName());
    }

    public function setModel($model)
    {
        if (is_string($model) && method_exists($this, 'setModelForOptions')) {
            return $this->setModelForOptions($model);
        }

        if (! $model instanceof Model) {
            throw new InvalidArgumentException('Editable column model must be an Eloquent model.');
        }

        $this->model = $model;

        if ($this->getAppends() instanceof WithModelInterface) {
            $this->getAppends()->setModel($model);
        }

        return $this;
    }

    public function getModifier()
    {
        return $this->modifier;
    }

    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        return is_null($this->modifier) ? $this->getModelValue() : $this->modifier;
    }

    public function setModifier($modifier)
    {
        $this->modifier = $modifier;

        return $this;
    }

    public function getValidationRules(): array
    {
        return $this->validationRules;
    }

    public function getValidationMessages(): array
    {
        return $this->validationMessages;
    }

    public function validate(Request $request): void
    {
        if (empty($this->validationRules)) {
            return;
        }

        Validator::make(
            ['value' => $request->input('value')],
            ['value' => $this->validationRules],
            $this->validationMessagesForInlineInput(),
            ['value' => $this->getTitle()]
        )->validate();
    }

    public function isRequired(): bool
    {
        foreach ($this->validationRules as $rule) {
            if (is_string($rule) && explode(':', $rule, 2)[0] === 'required') {
                return true;
            }
        }

        return false;
    }

    public function getTitle()
    {
        return $this->title ?? $this->getHeader()->getTitle();
    }

    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    public function getUrl()
    {
        if (! $this->url) {
            $url = request()->url();
            if (request()->getScheme() != rtrim(URL::formatScheme(), ':/')) {
                $url = preg_replace('~^[^:]+://~isu', URL::formatScheme(), $url);
            }

            return str_replace('/async', '/async-inline', $url);
        }

        return str_replace('/async', '/async-inline', $this->url);
    }

    public function setUrl(?string $url)
    {
        $this->url = $url;

        return $this;
    }

    public function getEditableMode()
    {
        return $this->editableMode;
    }

    public function setEditableMode(?string $mode)
    {
        if (isset($mode) && in_array($mode, ['inline', 'popup'], true)) {
            $this->editableMode = $mode;
        }

        return $this;
    }

    public function isReadonly()
    {
        if (! $this->getModel()) {
            return true;
        }

        if ($this->getModelConfiguration()->isEditable($this->getModel())) {
            return $this->isColumnReadonly();
        }

        return true;
    }

    public function isColumnReadonly()
    {
        if (is_callable($this->readonlyEditable)) {
            return (bool) call_user_func($this->readonlyEditable, $this->getModel());
        }

        return (bool) $this->readonlyEditable;
    }

    public function setReadonly($readonlyEditable)
    {
        $this->readonlyEditable = $readonlyEditable;

        return $this;
    }

    public function isVisible()
    {
        if ($this->resolvedVisibility === null) {
            try {
                $this->resolvedVisibility = is_callable($this->visibleCondition)
                    ? (bool) call_user_func($this->visibleCondition, $this)
                    : (bool) $this->visibleCondition;
            } catch (Throwable $exception) {
                $this->resolvedVisibility = false;
                Log::warning('Column visibility condition failed; the column has been hidden.', [
                    'column' => static::class,
                    'reason' => $exception->getMessage(),
                ]);
            }
        }

        return $this->resolvedVisibility;
    }

    public function setVisible($visibleCondition)
    {
        $this->resolvedVisibility = null;
        $this->visibleCondition = $visibleCondition;

        return $this;
    }

    public function setVisibilityCondition($condition)
    {
        return $this->setVisible($condition);
    }

    public function setMetaData($columnMetaClass)
    {
        $this->columMetaClass = $columnMetaClass;

        return $this;
    }

    public function getMetaData()
    {
        return $this->columMetaClass ? app()->make($this->columMetaClass) : false;
    }

    public function setOrderCallback(Closure $callable)
    {
        $this->orderCallback = $callable;

        return $this->setOrderable($callable);
    }

    public function setSearchCallback(Closure $callable)
    {
        $this->searchCallback = $callable;

        return $this;
    }

    public function setFilterCallback(Closure $callable)
    {
        $this->filterCallback = $callable;

        return $this;
    }

    public function getOrderCallback()
    {
        return $this->orderCallback;
    }

    public function getSearchCallback()
    {
        return $this->searchCallback;
    }

    public function getFilterCallback()
    {
        return $this->filterCallback;
    }

    public function getHeader()
    {
        return $this->header;
    }

    public function getWidth()
    {
        return $this->width;
    }

    public function setWidth($width)
    {
        $this->width = is_int($width) ? $width.'px' : $width;

        return $this;
    }

    public function setSearchable($isSearchable)
    {
        $this->isSearchable = $isSearchable;

        return $this;
    }

    public function isSearchable()
    {
        return $this->isSearchable;
    }

    public function getAppends()
    {
        return $this->append;
    }

    public function append(ColumnInterface $append)
    {
        $this->append = $append;

        return $this;
    }

    public function setOrderable($orderable = true)
    {
        if ($orderable !== false && ! $orderable instanceof OrderByClauseInterface) {
            if (! is_string($orderable) && ! $orderable instanceof Closure) {
                $orderable = $this->getName();
            }

            $orderable = new OrderByClause($orderable);
        }

        $this->orderByClause = $orderable;
        $this->getHeader()->setOrderable($this->isOrderable());

        return $this;
    }

    public function getOrderByClause()
    {
        return $this->orderByClause;
    }

    public function isOrderable()
    {
        return $this->orderByClause instanceof OrderByClauseInterface;
    }

    public function orderBy(Builder $query, $direction)
    {
        if (! $this->isOrderable()) {
            throw new InvalidArgumentException('Column is not orderable.');
        }

        $this->orderByClause->modifyQuery($query, $direction);

        return $this;
    }

    public function setClass($class)
    {
        $this->setHtmlAttribute('class', $class);

        return $this;
    }

    public function nowrap()
    {
        return $this->setClass('text-nowrap');
    }

    protected function editableColumnToArray(): array
    {
        $small = $this->getSmall();
        if ($this->isolated && $small) {
            $small = htmlspecialchars($small);
        }

        return [
            'attributes' => $this->htmlAttributesToString(),
            'attributesArray' => $this->getHtmlAttributes(),
            'model' => $this->getModel(),
            'append' => $this->getAppends(),
            'name' => $this->getName(),
            'small' => $small,
            'visibled' => $this->getVisibled(),
            'id' => $this->getModel()->getKey(),
            'value' => $this->getModelValue(),
            'isReadonly' => $this->isReadonly(),
            'url' => $this->getUrl(),
            'title' => $this->getTitle(),
            'mode' => $this->getEditableMode(),
            'required' => $this->isRequired(),
            'text' => $this->getModifierValue(),
        ];
    }

    protected function persistInlineFormValue(
        Request $request,
        callable $save,
        ?callable $afterSave = null,
        bool $returnValue = false
    ) {
        $input = [];
        Arr::set($input, $this->getPath(), $request->input('value', $this->getDefaultValue()));
        $request->merge($input);

        $save($request);
        $this->getModel()->save();
        $afterSave?->__invoke($request);

        return $returnValue ? $request->input($this->getPath()) : null;
    }

    protected function getModelConfiguration(): ModelConfigurationInterface
    {
        return app('sleeping_owl')->getModel($this->getModel());
    }

    protected function getValueFromObject($instance, $name)
    {
        if ($name instanceof Closure) {
            return $name($instance);
        }

        if (! $name) {
            return null;
        }

        if (strpos($name, '.') === false && strpos($name, '->') !== false) {
            $casts = collect($instance->getCasts());
            $jsonParts = collect(explode('->', $name));
            $jsonAttribute = $instance->{$jsonParts->first()};
            $cast = $casts->get($jsonParts->first(), false);

            if ($cast === 'object') {
                $jsonAttribute = json_decode(json_encode($jsonAttribute), true);
            } elseif ($cast !== 'array') {
                $jsonAttribute = json_decode($jsonAttribute);
            }

            return Arr::get($jsonAttribute, $jsonParts->slice(1)->implode('.'));
        }

        $parts = explode('.', $name);
        $part = array_shift($parts);

        if ($instance instanceof Collection) {
            $instance = $instance->pluck($part);
        } elseif ($instance instanceof SupportCollection) {
            $instance = $instance->first();
            if ($instance instanceof Collection) {
                $instance = $instance->pluck($part);
            }
            if ($instance === null) {
                $instance = collect();
            }
        } elseif (! is_null($instance)) {
            $instance = $instance->getAttribute($part);
        }

        return ! empty($parts) && ! is_null($instance)
            ? $this->getValueFromObject($instance, implode('.', $parts))
            : $instance;
    }

    private function validationMessagesForInlineInput(): array
    {
        $messages = [];
        $localizedMessages = trans('sleeping_owl::validation');

        if (is_array($localizedMessages)) {
            foreach ($this->validationRules as $rule) {
                if (! is_string($rule)) {
                    continue;
                }

                $ruleName = Str::snake(explode(':', $rule, 2)[0]);
                if (array_key_exists($ruleName, $localizedMessages)) {
                    $messages['value.'.$ruleName] = $localizedMessages[$ruleName];
                }
            }
        }

        foreach ($this->validationMessages as $rule => $message) {
            $messages['value.'.$rule] = $message;
        }

        return $messages;
    }
}

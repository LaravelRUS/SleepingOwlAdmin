<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\AdminInterface;

class Filter extends NamedColumn
{
    /**
     * Filter related model.
     *
     * @var Model|null
     */
    protected ?Model $relatedModel = null;

    /**
     * Field to get filter value from.
     *
     * @var string|null
     */
    protected ?string $field = null;

    /**
     * @var bool
     */
    protected bool $orderable = false;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * @var string
     */
    protected string $view = 'column.filter';

    /**
     * @return mixed
     */
    public function getRelatedModel(): mixed
    {
        if (is_null($this->relatedModel)) {
            $this->setRelatedModel($this->getModel());
        }

        return $this->relatedModel;
    }

    /**
     * @param  string|Model  $relatedModel
     * @return $this
     */
    public function setRelatedModel(Model|string $relatedModel): Filter
    {
        $this->relatedModel = $relatedModel;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getField(): ?string
    {
        if (is_null($this->field)) {
            $this->setField($this->isSelf() ? $this->getName() : 'id');
        }

        return $this->field;
    }

    /**
     * @param  string  $field
     * @return $this
     */
    public function setField(string $field): static
    {
        $this->field = $field;

        return $this;
    }

    /**
     * Get filter url.
     *
     * @return string
     */
    public function getUrl(): string
    {
        $request = clone request();

        $request->merge([
            $this->getName() => $this->getValue(),
            'page' => 1,
        ]);

        /** @var AdminInterface $so */
        $so = app('sleeping_owl');

        return $so->getModel($this->getRelatedModel())
            ->getDisplayUrl($request->all());
    }

    /**
     * Check if filter applies to the current model.
     *
     * @return bool
     */
    protected function isSelf(): bool
    {
        return get_class($this->getModel()) == get_class($this->getRelatedModel());
    }

    /**
     * @return string|null
     */
    protected function getValue(): ?string
    {
        return $this->getModelValue();
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'icon' => $this->isSelf() ? 'fas fa-filter' : 'fas fa-long-arrow-alt-right',
            'title' => $this->isSelf() ? trans('sleeping_owl::lang.table.filter') : trans('sleeping_owl::lang.table.filter-goto'),
            'url' => $this->getUrl(),
            'value' => $this->getValue(),
        ];
    }
}

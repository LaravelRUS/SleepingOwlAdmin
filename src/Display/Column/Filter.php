<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Model;

class Filter extends NamedColumn
{
    /**
     * Filter related model.
     *
     * @var Model
     */
    protected $relatedModel = null;

    /**
     * Field to get filter value from.
     *
     * @var string
     */
    protected $field = null;

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @var string
     */
    protected $view = 'column.filter';

    /**
     * @return mixed
     */
    public function getRelatedModel()
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
    public function setRelatedModel($relatedModel)
    {
        $this->relatedModel = $relatedModel;

        return $this;
    }

    /**
     * @return string
     */
    public function getField()
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
    public function setField($field)
    {
        $this->field = $field;

        return $this;
    }

    /**
     * Get filter url.
     *
     * @return string
     */
    public function getUrl()
    {
        $request = clone request();

        $request->merge([
            $this->getName() => $this->getValue(),
            'page' => 1,
        ]);

        /** @var \SleepingOwl\Admin\Contracts\AdminInterface $so */
        $so = app('sleeping_owl');

        return $so->getModel($this->getRelatedModel())
            ->getDisplayUrl($request->all());
    }

    /**
     * Check if filter applies to the current model.
     *
     * @return bool
     */
    protected function isSelf()
    {
        return get_class($this->getModel()) == get_class($this->getRelatedModel());
    }

    /**
     * @return string
     */
    protected function getValue()
    {
        return $this->getModelValue();
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'icon' => $this->isSelf() ? 'fas fa-filter' : 'fas fa-long-arrow-alt-right',
            'title' => $this->isSelf() ? trans('sleeping_owl::lang.table.filter') : trans('sleeping_owl::lang.table.filter-goto'),
            'url' => $this->getUrl(),
            'value' => $this->getValue(),
        ];
    }
}

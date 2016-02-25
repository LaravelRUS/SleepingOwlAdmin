<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\NamedColumnInterface;

class Text extends BaseColumnFilter
{
    /**
     * @var string
     */
    protected $view = 'text';

    /**
     * @var string
     */
    protected $placeholder;

    /**
     * @return string
     */
    public function getPlaceholder()
    {
        return $this->placeholder;
    }

    /**
     * @param string $placeholder
     *
     * @return $this
     */
    public function setPlaceholder($placeholder)
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    /**
     * @param RepositoryInterface  $repository
     * @param NamedColumnInterface $column
     * @param Builder              $query
     * @param string               $search
     * @param array|string         $fullSearch
     * @param string               $operator
     *
     * @return void
     */
    public function apply(
        RepositoryInterface $repository,
        NamedColumnInterface $column,
        Builder $query,
        $search,
        $fullSearch,
        $operator = '='
    ) {
        if (empty($search)) {
            return;
        }

        if ($operator == 'like') {
            $search = '%'.$search.'%';
        }

        $name = $column->getName();

        if ($repository->hasColumn($name)) {
            $query->where($name, $operator, $search);
        } elseif (strpos($name, '.') !== false) {
            $parts = explode('.', $name);
            $fieldName = array_pop($parts);
            $relationName = implode('.', $parts);
            $query->whereHas($relationName, function ($q) use ($search, $fieldName, $operator) {
                $q->where($fieldName, $operator, $search);
            });
        }
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'placeholder' => $this->getPlaceholder(),
        ];
    }
}

<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use Illuminate\Database\Eloquent\Model;

class RelatedLink extends Link
{
    /**
     * @var string
     */
    protected string $view = 'column.link';

    /**
     * @var string
     */
    protected $originalName;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * @param  Closure|null|string  $name
     * @param  null|string  $label
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label, $small);
        $this->originalName = $name;
    }

    /**
     * @param  Model|null  $model
     * @return Link
     */
    public function setModel(?Model $model): Link
    {
        if (str_contains($this->originalName, '.')) {
            $parts = explode('.', $this->originalName);
            $name = array_pop($parts);

            while ($parts) {
                $part = array_shift($parts);
                $relation = $model->getAttribute($part);

                if ($relation instanceof Model) {
                    $model = $relation;
                    $this->setName($name);
                }
            }
        }

        return parent::setModel($model);
    }
}

<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Model;

class RelatedLink extends Link
{
    /**
     * @var string
     */
    protected $view = 'column.link';

    /**
     * @var string
     */
    protected $originalName;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @param  \Closure|null|string  $name
     * @param  null|string  $label
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label, $small);
        $this->originalName = $name;
    }

    /**
     * @param  Model  $model
     * @return Link
     */
    public function setModel(Model $model)
    {
        if (strpos($this->originalName, '.') !== false) {
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

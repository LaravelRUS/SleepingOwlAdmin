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
     * @param null|string $name
     * @param null|string $label
     * @param Model|null  $model
     */
    public function __construct($name, $label = null, Model $model = null)
    {
        parent::__construct($name, $label);
        $this->originalName = $name;

        if (! is_null($model)) {
            $this->setModel($model);
        }

        $this->setHtmlAttribute('class', 'row-link');
    }

    /**
     * @param Model $model
     *
     * @return $this
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

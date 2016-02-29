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
     * @param string $name
     *
     * @throws \Exception
     */
    public function __construct($name)
    {
        parent::__construct($name);
        $this->originalName = $name;

        $this->setAttribute('class', 'row-link');
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

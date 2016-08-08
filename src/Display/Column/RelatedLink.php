<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Model;
use KodiCMS\Assets\Contracts\MetaInterface;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

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
     * @param \Closure|null|string $name
     * @param null|string $label
     * @param TableHeaderColumnInterface $tableHeaderColumn
     * @param AdminInterface $admin
     * @param MetaInterface $meta
     */
    public function __construct($name,
                                $label,
                                TableHeaderColumnInterface $tableHeaderColumn,
                                AdminInterface $admin,
                                MetaInterface $meta)
    {
        parent::__construct($name, $label, $tableHeaderColumn, $admin, $meta);
        $this->originalName = $name;
    }

    /**
     * @param Model $model
     *
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

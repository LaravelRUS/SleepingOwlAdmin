<?php

namespace SleepingOwl\Admin\Display\Column;

use Collective\Html\FormBuilder;
use KodiCMS\Assets\Contracts\MetaInterface;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Display\TableColumn;

class Checkbox extends TableColumn
{
    /**
     * @var string
     */
    protected $view = 'column.checkbox';

    /**
     * Checkbox constructor.
     *
     * @param string|null $label
     * @param TableHeaderColumnInterface $tableHeaderColumn
     * @param AdminInterface $admin
     * @param MetaInterface $meta
     * @param FormBuilder $formBuilder
     */
    public function __construct($label,
                                TableHeaderColumnInterface $tableHeaderColumn,
                                AdminInterface $admin,
                                MetaInterface $meta,
                                FormBuilder $formBuilder)
    {
        parent::__construct($label, $tableHeaderColumn, $admin, $meta);

        $this->setLabel(
            $formBuilder->checkbox(null, 1, false, ['class' => 'adminCheckboxAll']
        ));

        $this->setOrderable(false);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => $this->getModel()->getKey(),
        ];
    }
}

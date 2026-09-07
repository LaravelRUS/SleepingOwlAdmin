<?php

namespace SleepingOwl\Admin\Display\Column;

use Spatie\Html\Html;

class Checkbox extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.checkbox';

    /**
     * @var string
     */
    protected $width = '30px';

    /**
     * Checkbox constructor.
     *
     * @param  string|null  $label
     */
    public function __construct($label = null)
    {
        parent::__construct($label);
        $html = app(Html::class);
        $id = 'admin_checkbox_all_'.spl_object_id($this);
        $checkbox = $html->checkbox(null, 0, false)
            ->attributes(['class' => 'adminCheckboxAll', 'id' => $id]);

        $this->setLabel(
            $html->div()
                ->class('icheck-primary text-center')
                ->children([$checkbox, $html->label('', $id)])
        );
    }

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @return mixed
     */
    public function getModelValue()
    {
        return $this->getModel()->getKey();
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => $this->getModelValue(),
        ];
    }
}

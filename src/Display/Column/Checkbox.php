<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Support\HtmlString;
use SleepingOwl\Admin\Support\HtmlAttributeBag;

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
        $id = 'admin_checkbox_all_'.spl_object_id($this);
        $checkbox = new HtmlAttributeBag([
            'type' => 'checkbox',
            'value' => 0,
            'class' => 'adminCheckboxAll',
            'id' => $id,
        ]);
        $label = new HtmlAttributeBag(['for' => $id]);

        $this->setLabel(new HtmlString(
            '<div class="icheck-primary text-center">'.
            "<input {$checkbox}><label {$label}></label></div>"
        ));
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

<?php

namespace SleepingOwl\Admin\Form\Element;

use SleepingOwl\Admin\Traits\Collapsed;

class Trix extends NamedFormElement
{
    use Collapsed;

    /**
     * @var bool|null
     */
    protected $collapsed;

    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        $this->setHtmlAttributes([
            'class' => 'trix-data',
        ]);
    }

    /**
     * @var string
     */
    protected $view = 'form.element.trix';

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'collapsed' => $this->getCollapsed(),
        ];
    }
}

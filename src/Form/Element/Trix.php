<?php

namespace SleepingOwl\Admin\Form\Element;

use SleepingOwl\Admin\Traits\Collapsed;

class Trix extends NamedFormElement
{
    use Collapsed;

    /**
     * @var bool
     */
    protected bool $collapsed;

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
    protected string $view = 'form.element.trix';

    /**
     * @return array
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'collapsed' => $this->getCollapsed(),
        ];
    }
}

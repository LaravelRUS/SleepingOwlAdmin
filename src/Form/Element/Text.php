<?php

namespace SleepingOwl\Admin\Form\Element;

class Text extends NamedFormElement
{
    /**
     * @var string
     */
    protected $view = 'form.element.text';

    /**
     * @var bool
     */
    protected $dataList = false;

    /**
     * @var array
     */
    protected $options = [];

    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        $this->setHtmlAttributes([
            'class' => 'form-control',
            'type' => 'text',
        ]);
    }

    /**
     * @param array
     * @return $this
     */
    public function setOptions(array $options): Text
    {
        $this->options = $options;
        $this->dataList = true;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        if ($this->dataList) {
            $this->setHtmlAttributes([
                'list' => $this->getId().'Datalist',
            ]);

            return
                parent::toArray() + [
                    'datalistOptions' => $this->options,
                ];
        }

        return parent::toArray();
    }
}

<?php

namespace SleepingOwl\Admin\Form\Element;

class Textarea extends NamedFormElement
{
    /**
     * @var int
     */
    protected int $rows = 10;

    /**
     * @var string
     */
    protected string $view = 'form.element.textarea';

    /**
     * @return int
     */
    public function getRows()
    {
        return $this->rows;
    }

    /**
     * @param  int  $rows
     * @return $this
     */
    public function setRows(int $rows)
    {
        if ($rows < 1) {
            $rows = 1;
        }

        $this->rows = $rows;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        $this->setHtmlAttributes([
            'class' => 'form-control',
            'rows' => $this->getRows(),
        ]);

        return parent::toArray() + [
            'rows' => $this->getRows(),
        ];
    }
}

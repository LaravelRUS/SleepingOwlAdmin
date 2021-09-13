<?php

namespace SleepingOwl\Admin\Form\Element;

class Textarea extends NamedFormElement
{
    /**
     * @var int
     */
    protected $rows = 10;

    /**
     * @var string
     */
    protected $view = 'form.element.textarea';

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
    public function setRows($rows)
    {
        intval($rows);
        if ($rows < 1) {
            $rows = 1;
        }

        $this->rows = $rows;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
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

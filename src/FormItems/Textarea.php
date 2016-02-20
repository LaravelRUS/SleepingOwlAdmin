<?php

namespace SleepingOwl\Admin\FormItems;

class Textarea extends NamedFormItem
{
    /**
     * @var int
     */
    protected $rows = 10;

    /**
     * @return int
     */
    public function getRows()
    {
        return $this->rows;
    }

    /**
     * @param int $rows
     *
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
    public function getParams()
    {
        return parent::getParams() + [
            'name'     => $this->getName(),
            'label'    => $this->getLabel(),
            'readonly' => $this->isReadonly(),
            'value'    => $this->getValue(),
            'rows'     => $this->getRows(),
        ];
    }
}

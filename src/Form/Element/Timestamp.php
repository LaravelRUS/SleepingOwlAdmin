<?php

namespace SleepingOwl\Admin\Form\Element;

use Carbon\Carbon;

class Timestamp extends DateTime
{
    /**
     * @var bool
     */
    protected $seconds = true;

    /**
     * @var string
     */
    protected $view = 'form.element.timestamp';

    /**
     * @return $this|NamedFormElement|mixed|null|string
     */
    public function getValueFromModel()
    {
        $value = parent::getValueFromModel();

        if (empty($value)) {
            $value = Carbon::now()->timezone($this->getTimezone())->format($this->getFormat());
        }

        return $value;
    }
}

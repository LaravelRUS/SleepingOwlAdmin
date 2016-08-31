<?php

namespace SleepingOwl\Admin\Form\Element;

use Carbon\Carbon;
use Illuminate\Http\Request;

class Timestamp extends DateTime
{
    /**
     * @var string
     */
    protected $defaultConfigFormat = 'datetimeFormat';

    /**
     * @var bool
     */
    protected $seconds = true;

    /**
     * @param Request $request
     *
     * @return $this|mixed|null|NamedFormElement|string
     */
    public function getValue(Request $request)
    {
        $value = parent::getValue($request);

        if (empty($value)) {
            $value = Carbon::now()->format($this->getFormat());
        }

        return $value;
    }
}

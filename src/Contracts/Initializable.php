<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Validation\Validator;
use SleepingOwl\Admin\Model\ModelConfiguration;

interface Initializable
{
    /**
     * Initialize class
     */
    public function initialize();
}
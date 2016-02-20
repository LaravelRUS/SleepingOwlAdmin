<?php

namespace SleepingOwl\Admin\FormItems;

class File extends Image
{
    /**
     * @var string
     */
    protected static $route = 'uploadFile';

    /**
     * @return array
     */
    protected static function uploadValidationRules()
    {
        return [
            'file' => 'required',
        ];
    }
}

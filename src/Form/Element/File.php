<?php

namespace SleepingOwl\Admin\Form\Element;

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

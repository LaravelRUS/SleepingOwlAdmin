<?php

namespace SleepingOwl\Admin\Contracts\Wysiwyg;

interface WysiwygFilterInterface
{
    /**
     * @param  string  $text
     * @return string
     */
    public function apply($text);
}

<?php

namespace SleepingOwl\Admin\Wysiwyg;

use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;

class MarkdownFilter implements WysiwygFilterInterface
{
    /**
     * @param  string  $text
     * @return string
     */
    public function apply($text)
    {
        return (new \Parsedown())->text($text);
    }
}

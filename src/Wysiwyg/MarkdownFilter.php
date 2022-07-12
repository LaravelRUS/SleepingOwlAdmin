<?php

namespace SleepingOwl\Admin\Wysiwyg;

use Parsedown;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;

class MarkdownFilter implements WysiwygFilterInterface
{
    /**
     * @param string $text
     * @return string
     */
    public function apply(string $text): string
    {
        return (new Parsedown())->text($text);
    }
}

<?php

namespace SleepingOwl\Admin\Wysiwyg;


use Illuminate\Support\Facades\Blade;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;

class DummyFilter implements WysiwygFilterInterface
{
    /**
     * @param string $text
     * @return string
     */
    public function apply(string $text): string
    {
        return Blade::compileString(
            preg_replace(['/<(\?|\%)\=?(php)?/', '/(\%|\?)>/'], ['', ''], $text)
        );
    }
}

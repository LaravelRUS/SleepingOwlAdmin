<?php

namespace SleepingOwl\Admin\Wysiwyg;

use Illuminate\View\Compilers\BladeCompiler;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;

class DummyFilter implements WysiwygFilterInterface
{
    /**
     * @var BladeCompiler
     */
    protected $compiler;

    /**
     * DummyFilter constructor.
     * @param BladeCompiler $compiler
     */
    public function __construct(BladeCompiler $compiler)
    {
        $this->compiler = $compiler;
    }

    /**
     * @param string $text
     *
     * @return string
     */
    public function apply($text)
    {
        return $this->compiler->compileString(
            preg_replace(['/<(\?|\%)\=?(php)?/', '/(\%|\?)>/'], ['', ''], $text)
        );
    }
}

<?php

namespace SleepingOwl\Admin\Wysiwyg;

use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;

class MarkdownFilter implements WysiwygFilterInterface
{
    /**
     * @var \Parsedown
     */
    protected $markdownParser;

    /**
     * MarkdownFilter constructor.
     * @param \Parsedown $parsedown
     */
    public function __construct(\Parsedown $parsedown)
    {
        $this->markdownParser = $parsedown;
    }

    /**
     * @param string $text
     *
     * @return string
     */
    public function apply($text)
    {
        return $this->markdownParser->text($text);
    }
}

<?php

namespace SleepingOwl\Admin\Display;

use KodiComponents\Support\HtmlAttributes;

class Element
{
    use HtmlAttributes;

    protected $text;
    protected $tag;

    public function __construct($text, $tag = 'span')
    {
        $this->text = $text;
        $this->tag = $tag;
    }

    public function getText()
    {
        return $this->text;
    }

    public function setText($text)
    {
        $this->text = $text;
    }

    public function getTag()
    {
        return $this->tag;
    }

    public function setTag($tag)
    {
        $this->tag = $tag;
    }

    public static function create($text)
    {
        return new static($text);
    }

    public function attributes()
    {
        return $this->htmlAttributesToString();
    }
}

<?php

namespace SleepingOwl\Admin\Display;

use KodiComponents\Support\HtmlAttributes;

class Link
{
    use HtmlAttributes;

    protected $url;
    protected $title;

    public function __construct($url, $title)
    {
        $this->url = $url;
        $this->title = $title;
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function blank()
    {
        $this->setHtmlAttribute('target', '_blank');

        return $this;
    }

    public static function create($url, $title)
    {
        return new static($url, $title);
    }

    public function attributes()
    {
        return $this->htmlAttributesToString();
    }
}

<?php

namespace SleepingOwl\Admin\Contracts\Wysiwyg;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Support\Arrayable;

interface WysiwygEditorInterface extends Arrayable
{
    /**
     * @return string
     */
    public function getId();

    /**
     * @return string
     */
    public function getName();

    /**
     * @return WysiwygFilterInterface
     */
    public function getFilter();

    /**
     * @return Repository
     */
    public function getConfig();

    /**
     * @return bool
     */
    public function isUsed();

    /**
     * @param  string  $text
     * @return string
     */
    public function applyFilter($text);

    /**
     * @return void
     */
    public function load();

    /**
     * @return void
     */
    public function unload();
}

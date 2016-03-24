<?php

namespace SleepingOwl\Admin\Contracts\Wysiwyg;

interface WysiwygEditorInterface
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
     * @return bool
     */
    public function isUsed();

    /**
     * @param string $text
     *
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

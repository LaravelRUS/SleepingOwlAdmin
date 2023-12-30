<?php

namespace SleepingOwl\Admin\Contracts\Wysiwyg;

use SleepingOwl\Admin\Exceptions\WysiwygException;

interface WysiwygMangerInterface
{
    /**
     * @return string|null
     */
    public function getDefaultEditorId();

    /**
     * @param  string  $editorId
     * @param  WysiwygFilterInterface|null  $filter
     * @param  string|null  $name
     * @return WysiwygEditorInterface
     */
    public function register($editorId, WysiwygFilterInterface $filter = null, $name = null);

    /**
     * @return \Illuminate\Support\Collection|WysiwygEditorInterface[]
     */
    public function getFilters();

    /**
     * @param  string  $editorId
     * @return WysiwygEditorInterface|null
     */
    public function getEditor($editorId);

    /**
     * @param  string  $editorId
     * @return bool
     */
    public function loadEditor($editorId);

    /**
     * @param  string  $editorId
     * @param  string  $text
     * @return string string
     *
     * @throws WysiwygException
     */
    public function applyFilter($editorId, $text);
}

<?php

namespace SleepingOwl\Admin\Contracts\Wysiwyg;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Exceptions\WysiwygException;
use SleepingOwl\Admin\Wysiwyg\Editor;

interface ManagerInterface
{
    /**
     * @param string $editorId
     * @param WysiwygFilterInterface|null $filter
     * @param string|null $name
     *
     * @return WysiwygEditorInterface
     */
    public function register($editorId, WysiwygFilterInterface $filter = null, $name = null);

    /**
     * @return Collection|Editor[]
     */
    public function getFilters();

    /**
     * @param string $editorId
     *
     * @return WysiwygEditorInterface|null
     */
    public function getEditor($editorId);

    /**
     * @param string $editorId
     *
     * @return bool
     */
    public function loadEditor($editorId);

    /**
     * @param string $editorId
     * @param string $text
     *
     * @return string string
     * @throws WysiwygException
     */
    public function applyFilter($editorId, $text);

    /**
     * @return array
     */
    public function getFiltersList();
}

<?php

namespace SleepingOwl\Admin\Contracts\Wysiwyg;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Exceptions\WysiwygException;

interface WysiwygMangerInterface
{
    /**
     * @return string|null
     */
    public function getDefaultEditorId(): ?string;

    /**
     * @param  string  $editorId
     * @param  WysiwygFilterInterface|null  $filter
     * @param  string|null  $name
     * @return WysiwygEditorInterface
     */
    public function register(string $editorId, WysiwygFilterInterface $filter = null, string $name = null): WysiwygEditorInterface;

    /**
     * @return Collection|WysiwygEditorInterface[]
     */
    public function getFilters();

    /**
     * @param  string  $editorId
     * @return WysiwygEditorInterface|null
     */
    public function getEditor(string $editorId): ?WysiwygEditorInterface;

    /**
     * @param  string  $editorId
     * @return bool
     */
    public function loadEditor(string $editorId): bool;

    /**
     * @param  string  $editorId
     * @param  string  $text
     * @return string string
     *
     * @throws WysiwygException
     */
    public function applyFilter(string $editorId, string $text): string;
}

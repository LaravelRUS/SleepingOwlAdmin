<?php

namespace SleepingOwl\Admin\Wysiwyg;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygEditorInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;
use SleepingOwl\Admin\Exceptions\WysiwygException;

class Manager
{
    /**
     * @var
     */
    protected $config;

    /**
     * Available wysiwyg editors.
     *
     * @var Collection|Editor[]
     */
    protected $filters;

    public function __construct()
    {
        $this->filters = new Collection();
    }

    /**
     * @return string|null
     */
    public function getDefaultEditorId()
    {
        return config('sleeping_owl.wysiwyg.default', 'ckeditor');
    }

    /**
     * @param string                      $editorId
     * @param WysiwygFilterInterface|null $filter
     * @param string|null                 $name
     *
     * @return WysiwygEditorInterface
     */
    public function register($editorId, WysiwygFilterInterface $filter = null, $name = null)
    {
        $config = config('sleeping_owl.wysiwyg.'.$editorId, []);

        $this->getFilters()->push(
            $editor = new Editor($editorId, $name, $filter, $config)
        );

        return $editor;
    }

    /**
     * @return Collection|Editor[]
     */
    public function getFilters()
    {
        return $this->filters;
    }

    /**
     * @param string $editorId
     *
     * @return WysiwygEditorInterface|null
     */
    public function getEditor($editorId)
    {
        return $this->getFilters()->filter(function (WysiwygEditorInterface $editor) use ($editorId) {
            return $editor->getId() == $editorId;
        })->first();
    }

    public function loadDefaultEditor()
    {
        $this->loadEditor($this->getDefaultEditor());
    }

    /**
     * @param string $editorId
     *
     * @return bool
     */
    public function loadEditor($editorId)
    {
        if (! is_null($editor = $this->getEditor($editorId))) {
            if ($editor->isUsed()) {
                return true;
            }

            return $editor->load();
        }

        return false;
    }

    /**
     * @param string $editorId
     * @param string $text
     *
     * @return string string
     * @throws WysiwygException
     */
    public function applyFilter($editorId, $text)
    {
        if (! is_null($editor = $this->getEditor($editorId))) {
            return $editor->applyFilter($text);
        }

        throw new WysiwygException("Editor [{$editorId}] not found");
    }

    /**
     * @return array
     */
    public function getFiltersList()
    {
        return $this->getFilters()->pluck('name', 'id')->all();
    }

    /**
     * @return WysiwygEditorInterface
     */
    protected function getDefaultEditor()
    {
        return $this->getEditor($this->getDefaultEditor());
    }
}

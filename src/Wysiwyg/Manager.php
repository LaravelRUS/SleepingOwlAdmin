<?php

namespace SleepingOwl\Admin\Wysiwyg;

use Illuminate\Config\Repository;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygEditorInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygMangerInterface;
use SleepingOwl\Admin\Exceptions\WysiwygException;

class Manager implements WysiwygMangerInterface
{
    /**
     * @var
     */
    protected $config;

    /**
     * Available wysiwyg editors.
     *
     * @var Collection|WysiwygEditorInterface[]
     */
    protected $filters;

    /**
     * @var Application
     */
    protected $app;

    /**
     * Manager constructor.
     *
     * @param  Application  $application
     */
    public function __construct(Application $application)
    {
        $this->filters = new Collection();
        $this->app = $application;

        $this->config = new Repository(
            $this->app['config']->get('sleeping_owl.wysiwyg', [])
        );
    }

    /**
     * @return string|null
     */
    public function getDefaultEditorId()
    {
        return $this->config->get('default', 'ckeditor');
    }

    /**
     * @param  string  $editorId
     * @param  WysiwygFilterInterface|null  $filter
     * @param  string|null  $name
     * @return WysiwygEditorInterface
     */
    public function register($editorId, WysiwygFilterInterface $filter = null, $name = null)
    {
        $this->getFilters()->push(
            $editor = new Editor($editorId, $name, $filter, $this->config->get($editorId, []))
        );

        return $editor;
    }

    /**
     * @return Collection|WysiwygEditorInterface[]
     */
    public function getFilters()
    {
        return $this->filters;
    }

    /**
     * @param  string  $editorId
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
     * @param  string  $editorId
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
     * @param  string  $editorId
     * @param  string  $text
     * @return string string
     *
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

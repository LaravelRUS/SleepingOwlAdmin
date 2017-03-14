<?php

if (! function_exists('resources_url')) {
    /**
     * @param string $path
     *
     * @return string
     */
    function resources_url($path)
    {
        return app(\SleepingOwl\Admin\Contracts\Template\TemplateInterface::class)->assetPath($path);
    }
}

/*
|--------------------------------------------------------------------------
| Wysiwyg Editors
|--------------------------------------------------------------------------
*/

$this->app['sleeping_owl.wysiwyg']->register('ckeditor')
    ->js(null, '//cdn.ckeditor.com/4.5.7/standard/ckeditor.js', null, true);

$this->app['sleeping_owl.wysiwyg']->register('tinymce')
    ->js(null, '//cdn.tinymce.com/4/tinymce.min.js', null, true);

$this->app['sleeping_owl.wysiwyg']->register('simplemde', new \SleepingOwl\Admin\Wysiwyg\MarkdownFilter())
    ->js(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.js', null, true)
    ->css(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');

<?php

if (! function_exists('resources_url')) {
    function resources_url($path)
    {
        return '/packages/sleepingowl/default/'.$path;
    }
}

/*
|--------------------------------------------------------------------------
| Wysiwyg Editors
|--------------------------------------------------------------------------
*/

WysiwygManager::register('ckeditor')
    ->js(null, '//cdn.ckeditor.com/4.5.7/standard/ckeditor.js', ['jquery']);

WysiwygManager::register('tinymce')
    ->js(null, '//cdn.tinymce.com/4/tinymce.min.js', ['jquery']);

WysiwygManager::register('simplemde', new \SleepingOwl\Admin\Wysiwyg\MarkdownFilter())
    ->js(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.js', ['jquery'])
    ->css(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');

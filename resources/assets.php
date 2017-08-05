<?php

/*
|--------------------------------------------------------------------------
| Wysiwyg Editors
|--------------------------------------------------------------------------
*/

$this->app['sleeping_owl.wysiwyg']->register('ckeditor')
    ->js(null, '/packages/sleepingowl/ckeditor/ckeditor.js', null, true);

$this->app['sleeping_owl.wysiwyg']->register('tinymce')
    ->js(null, '//cdn.tinymce.com/4/tinymce.min.js', null, true);

$this->app['sleeping_owl.wysiwyg']->register('simplemde', new \SleepingOwl\Admin\Wysiwyg\MarkdownFilter())
    ->js(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.js', null, true)
    ->css(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');

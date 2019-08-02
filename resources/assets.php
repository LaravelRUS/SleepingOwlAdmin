<?php

/*
|--------------------------------------------------------------------------
| Wysiwyg Editors
|--------------------------------------------------------------------------
*/

$this->app['sleeping_owl.wysiwyg']->register('ckeditor')
    ->js(null, '/packages/sleepingowl/ckeditor/ckeditor.js', null, true);

$this->app['sleeping_owl.wysiwyg']->register('ckeditor5')
    ->js(null, '//cdn.ckeditor.com/ckeditor5/12.3.1/classic/ckeditor.js', null, true)
    ->js('translate', '//cdn.ckeditor.com/ckeditor5/12.3.1/classic/translations/'. app()->getLocale() .'.js', null, true);

$this->app['sleeping_owl.wysiwyg']->register('tinymce')
    ->js(null, '//cdn.tinymce.com/4/tinymce.min.js', null, true);

$this->app['sleeping_owl.wysiwyg']->register('simplemde', new \SleepingOwl\Admin\Wysiwyg\MarkdownFilter())
    ->js(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.js', null, true)
    ->css(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');

$this->app['sleeping_owl.wysiwyg']->register('summernote', new \SleepingOwl\Admin\Wysiwyg\MarkdownFilter())
  ->css('mdwn1', '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror.css')
  ->css('mdwn2', '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/theme/monokai.css')
  ->js('mdwn3', '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror.js', null, true)
  ->js('mdwn4', '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.js', null, true)
  ->js('mdwn5', '//cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.js', null, true)
  ->js(null, '//cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-bs4.min.js', null, true)
  ->js('lang', '//cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/lang/summernote-ru-RU.min.js', null, true)
  ->css(null, '//cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-bs4.css');

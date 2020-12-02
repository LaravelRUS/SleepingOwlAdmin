<?php

/*
|--------------------------------------------------------------------------
| Wysiwyg Editors
|--------------------------------------------------------------------------
*/

/**
 * @var SleepingOwl\Admin\Wysiwyg\Manager $wysiwyg_manager
 */
$wysiwyg_manager = $this->app['sleeping_owl.wysiwyg'];

$wysiwyg_manager->register('ckeditor')
    ->js(null, '/packages/sleepingowl/ckeditor/ckeditor.js', 'admin-default', false);

$wysiwyg_manager->register('ckeditor5')
    ->js(null, config('sleeping_owl.wysiwyg.ckeditor5.files.editor', '//cdn.ckeditor.com/ckeditor5/23.1.0/classic/ckeditor.js'), null, false)
    ->js('ckeditor5-translate', config('sleeping_owl.wysiwyg.ckeditor5.files.translation', '//cdn.ckeditor.com/ckeditor5/23.1.0/classic/translations/'.config('app.locale').'.js'), null, false);

$wysiwyg_manager->register('tinymce')
    ->js(null, '//cdn.tinymce.com/4/tinymce.min.js', null, false);

$wysiwyg_manager->register('simplemde', new \SleepingOwl\Admin\Wysiwyg\MarkdownFilter())
    ->js(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.js', null, false)
    ->css(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');

$wysiwyg_manager->register('summernote', new \SleepingOwl\Admin\Wysiwyg\MarkdownFilter())
    ->css('mdwn1', '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror.css')
    ->css('mdwn2', '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/theme/monokai.css')
    ->js('mdwn3', '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror.js', null, false)
    ->js('mdwn4', '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.js', null, false)
    ->js('mdwn5', '//cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.js', null, false)
    ->js(null, '//cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-bs4.min.js', null, false)
    ->js('lang', '//cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/lang/summernote-ru-RU.min.js', null, false)
    ->css(null, '//cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-bs4.css');

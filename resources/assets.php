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

/**
 * Ckeditor 5 CDN & local version.
 */
$ck5CDN = '//cdn.ckeditor.com/ckeditor5/';
$ck5CDN .= config('sleeping_owl.wysiwyg_cdn.ckeditor5.ver', '23.1.0');
if (config('sleeping_owl.wysiwyg_cdn.ckeditor5.useCdn')) {
    $wysiwyg_manager->register('ckeditor5')
        ->js(null, $ck5CDN.'/classic/ckeditor.js', null, false)
        ->js('ckeditor5-translate', $ck5CDN.'/classic/translations/'.config('app.locale').'.js', null, false);
} else {
    $wysiwyg_manager->register('ckeditor5')
        ->js(null, config('sleeping_owl.wysiwyg.ckeditor5.files.editor', $ck5CDN.'/classic/ckeditor.js'), null, false)
        ->js('ckeditor5-translate', config('sleeping_owl.wysiwyg.ckeditor5.files.translation', $ck5CDN.'/classic/translations/'.config('app.locale').'.js'), null, false);
}

/**
 * Tinymce CDN version.
 */
$tinyCDN = '//cdn.tiny.cloud/1/';
$tinyCDN .= config('sleeping_owl.wysiwyg_cdn.tinymce.api', 'no-api-key');
$tinyCDN .= '/tinymce/'.config('sleeping_owl.wysiwyg_cdn.tinymce.ver', '4').'/tinymce.min.js';
$wysiwyg_manager->register('tinymce')->js(null, $tinyCDN, null, false);

/**
 * Simplemde CDN ver.
 */
$wysiwyg_manager->register('simplemde', new \SleepingOwl\Admin\Wysiwyg\MarkdownFilter())
    ->js(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.js', null, false)
    ->css(null, '//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');

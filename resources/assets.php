<?php

if (! function_exists('resources_url')) {
    function resources_url($path)
    {
        return '/packages/sleepingowl/default/'.$path;
    }
}

PackageManager::add(\SleepingOwl\Admin\FormItems\Date::class)
    ->with('datetimepicker');

PackageManager::add(\SleepingOwl\Admin\FormItems\Select::class)
    ->with('select2');

PackageManager::add(\SleepingOwl\Admin\Display\DisplayDatatables::class)
    ->js(null, resources_url('js/datatables.min.js'), ['datatables'])
    ->with('datatables');

PackageManager::add(\SleepingOwl\Admin\Display\DisplayDatatablesAsync::class)
    ->js(null, resources_url('js/datatables.min.js'), ['datatables'])
    ->with('datatables');

PackageManager::add('libraries')
    ->js(null, resources_url('js/libraries.js'), ['jquery']);

PackageManager::add('admin-default')
    ->js(null, resources_url('js/admin-default.js'), ['libraries', 'metisMenu', 'datatables'])
    ->css(null, resources_url('css/common.css'));

PackageManager::add('flow.js')
    ->js(null, resources_url('libs/flow.js/js/flow.min.js'), ['jquery']);

PackageManager::add('bootbox.js')
    ->js(null, resources_url('libs/bootbox.js/js/bootbox.js'), ['jquery']);

PackageManager::add('bootstrap')
    ->js(null, resources_url('libs/bootstrap/js/bootstrap.min.js'), ['jquery'])
    ->css(null, resources_url('libs/bootstrap/css/bootstrap.min.css'));

PackageManager::add('ckeditor')
    ->js(null, resources_url('libs/ckeditor/js/ckeditor.js'), ['jquery']);

PackageManager::add('datatables')
    ->js(null, resources_url('libs/datatables/js/jquery.dataTables.min.js'), ['jquery', 'libraries'])
    ->js('dataTables-theme', resources_url('libs/datatables/js/dataTables.bootstrap.min.js'), ['datatables'])
    ->css('dataTables-theme', resources_url('libs/datatables/css/dataTables.bootstrap.min.css'));

PackageManager::add('datetimepicker')
    ->js(null, resources_url('libs/datetimepicker/js/jquery.datetimepicker.full.min.js'), ['jquery', 'libraries'])
    ->css(null, resources_url('libs/datetimepicker/css/jquery.datetimepicker.css'));

PackageManager::add('ekko-lightbox')
    ->js(null, resources_url('libs/ekko-lightbox/js/ekko-lightbox.min.js'), ['jquery']);

PackageManager::add('font-awesome')
    ->css(null, resources_url('libs/font-awesome/css/font-awesome.min.css'));

PackageManager::add('jquery')
    ->js(null, resources_url('libs/jquery/js/jquery.min.js'));

PackageManager::add('metisMenu')
    ->js(null, resources_url('libs/metisMenu/js/metisMenu.js'), ['jquery', 'libraries'])
    ->css(null, resources_url('libs/metisMenu/css/metisMenu.css'));

PackageManager::add('moment')
    ->js(null, resources_url('libs/moment/js/moment-with-locales.min.js'), ['jquery']);

PackageManager::add('nestable')
    ->js(null, resources_url('libs/nestable/js/jquery.nestable.js'), ['jquery']);

PackageManager::add('noty')
    ->js(null, resources_url('libs/noty/js/jquery.noty.packaged.min.js'), ['jquery']);

PackageManager::add('select2')
    ->js(null, resources_url('libs/select2/js/select2.full.min.js'), ['jquery'])
    ->css(null, resources_url('libs/select2/css/select2.min.css'));

PackageManager::add('Sortable')
    ->js(null, resources_url('libs/Sortable/js/Sortable.min.js'), ['jquery'])
    ->js('jquery.binding', resources_url('libs/Sortable/js/jquery.binding.js'), ['Sortable']);
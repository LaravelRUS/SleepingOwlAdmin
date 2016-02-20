<?php

return [
    /*
     * Admin title
     * Displays in page title and header
     */
    'title'                 => 'Sleeping Owl administrator',
    /*
     * Admin url prefix
     */
    'prefix'                => 'admin',

    /*
     * Middleware to use in admin routes
     */
    //'middleware'            => ['admin.auth'],
    'middleware'            => ['web'],

    /*
     * Path to admin bootstrap files directory
     * Default: app_path('Admin')
     */
    'bootstrapDirectory'    => app_path('Admin'),

    /*
     * Directory to upload images to (relative to public directory)
     */
    'imagesUploadDirectory' => 'images/uploads',

    /*
     * Template to use
     */
    'template'              => SleepingOwl\Admin\Templates\TemplateDefault::class,

    /*
     * Default date and time formats
     */
    'datetimeFormat'        => 'd.m.Y H:i',
    'dateFormat'            => 'd.m.Y',
    'timeFormat'            => 'H:i',

    /*
     * If you want, you can extend ckeditor default configuration
     * with this PHP Hash variable.
     *
     * Checkout http://docs.ckeditor.com/#!/api/CKEDITOR.config for more information.
     */
    'ckeditor'              => [],
];

<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Admin Title
    |--------------------------------------------------------------------------
    |
    | Displayed in title and header.
    |
    */

    'title'              => 'Sleeping Owl',

    /*
    |--------------------------------------------------------------------------
    | Admin Mini logo
    |--------------------------------------------------------------------------
    */
    'logo_mini'          => 'SO',

    /*
    |--------------------------------------------------------------------------
    | Admin Text on sidebar top menu
    |--------------------------------------------------------------------------
    */
    'menu_top'           => 'Main menu',

    /*
    |--------------------------------------------------------------------------
    | Sidebar default condition class "sidebar-collapse", "sidebar-open"
    |--------------------------------------------------------------------------
    | Sidebar mini show  'sidebar-mini' - 1024px , "sidebar-mini-md" - 768px,
    | "sidebar-mini-xs" - always
    |--------------------------------------------------------------------------
    | Font sizes "text-sm"
    |--------------------------------------------------------------------------
    | See https://adminlte.io/themes/v3/# - right top corner "Customize AdminLTE"
    */
    'body_default_class' => 'hold-transition sidebar-mini sidebar-open',

    /*
    |--------------------------------------------------------------------------
    | Admin Logo
    |--------------------------------------------------------------------------
    |
    | Displayed in navigation panel.
    |
    */

    'logo' => '<svg class="brand-image" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 216.123 216.123" style="enable-background:new 0 0 216.123 216.123;" xml:space="preserve" width="48px" height="48px"><g><path d="M173.65,106.51c6.549-7.024,10.567-16.436,10.567-26.774c0-8.585-2.775-16.529-7.464-23.001   c5.319-16.633,5.063-34.71-0.795-51.16L173.974,0l-5.827,1.03c-12.002,2.121-23.325,6.931-33.201,14.037H81.537v0.252   C71.577,8.071,60.122,3.176,47.977,1.03L42.149,0l-1.985,5.575c-5.858,16.45-6.114,34.527-0.795,51.16   c-4.689,6.472-7.464,14.417-7.464,23.001c0,10.338,4.018,19.75,10.567,26.773c-1.028,0.797-1.846,1.88-2.308,3.179   c-10.874,30.534-2.352,64.292,21.71,86c1.048,0.945,2.171,1.862,3.332,2.761v10.673c0,3.866,3.134,7,7,7s7-3.134,7-7v-2.194   c8.347,3.957,17.834,6.887,27.532,8.373c0.352,0.054,0.706,0.081,1.06,0.081s0.708-0.027,1.06-0.081   c4.446-0.681,16.123-2.878,28.059-8.434v2.255c0,3.866,3.134,7,7,7s7-3.134,7-7v-10.656c1.139-0.883,2.254-1.805,3.332-2.777   c24.062-21.709,32.583-55.466,21.71-86C175.496,108.389,174.678,107.306,173.65,106.51z M107.969,152.066   c-4.506-10.226-11.165-19.465-19.743-27.206c-2.717-2.451-5.583-4.7-8.571-6.748c13.12-2.887,23.804-12.341,28.406-24.734   c4.602,12.393,15.286,21.847,28.406,24.734c-2.988,2.048-5.854,4.297-8.57,6.748C119.346,132.575,112.595,141.88,107.969,152.066z    M71.206,54.436c13.951,0,25.301,11.35,25.301,25.301s-11.35,25.301-25.301,25.301s-25.301-11.35-25.301-25.301   S57.255,54.436,71.206,54.436z M170.218,79.736c0,13.951-11.35,25.301-25.301,25.301s-25.301-11.35-25.301-25.301   s11.35-25.301,25.301-25.301S170.218,65.786,170.218,79.736z M108.041,48.088c-3.04-6.825-7.023-13.231-11.845-19.021h23.699   C115.052,34.867,111.074,41.273,108.041,48.088z M164.562,16.17c2.468,9.767,2.65,20.018,0.566,29.875   c-5.909-3.558-12.824-5.61-20.21-5.61c-7.254,0-14.05,1.983-19.889,5.425c3.327-5.397,7.423-10.367,12.248-14.72   C145.142,24.043,154.479,18.934,164.562,16.17z M51.562,16.17c10.082,2.763,19.419,7.872,27.286,14.97   c4.792,4.324,8.877,9.293,12.205,14.695c-5.83-3.426-12.61-5.401-19.847-5.401c-7.386,0-14.301,2.051-20.21,5.61   C48.912,36.188,49.094,25.937,51.562,16.17z M51.555,120.283c10.084,2.763,19.425,7.873,27.293,14.972   c13.908,12.549,21.704,29.884,21.95,48.812v15.742c-10.093-2.564-21.543-7.294-29.546-14.514   C52.951,168.783,45.553,143.818,51.555,120.283z M144.871,185.295c-7.99,7.21-19.708,11.96-30.073,14.539v-15.766   c0.239-18.349,8.431-36.14,22.478-48.813c7.868-7.1,17.209-12.209,27.293-14.972C170.57,143.818,163.172,168.783,144.871,185.295z" fill="#FFFFFF"/><circle cx="71.206" cy="79.736" r="9.757" fill="#FFFFFF"/><circle cx="144.917" cy="79.736" r="9.757" fill="#FFFFFF"/></g></svg>',

    /*
    |--------------------------------------------------------------------------
    | Admin URL prefix
    |--------------------------------------------------------------------------
    */

    'url_prefix' => 'admin',

    /*
     * Subdomain & Domain support routes
     */
    'domain'     => false,

    /*
    |--------------------------------------------------------------------------
    | Middleware to use in admin routes
    |--------------------------------------------------------------------------
    |
    | In order to create authentication views and routes
    | don't forget to execute `php artisan make:auth`.
    | See https://laravel.com/docs/authentication
    |
    */

    'middleware'               => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Favicon
    |--------------------------------------------------------------------------
    */

    'favicon' => '/packages/sleepingowl/default/images/favicon.ico',

    /*
    |--------------------------------------------------------------------------
    | Load dev Vue js
    |--------------------------------------------------------------------------
    */

    'dev_assets' => env('ADMIN_DEV_ASSETS', false),

    /*
    |--------------------------------------------------------------------------
    | Env Editor
    |--------------------------------------------------------------------------
    | Url for env editor
    |
    */
    'env_editor_url'           => 'env/editor',

    /*
     * Excluded keys
     */
    'env_editor_excluded_keys' => [
        'APP_KEY', 'DB_*',
    ],

    /*
     * Env editor middlewares
     */
    'env_editor_middlewares'   => [],

    /*
     * Enable and show link in navigation
     * 'show_editor' is @deprecated
     */
    'enable_editor'            => false,
    'env_keys_readonly'        => false,
    'env_can_delete'           => true,
    'env_can_add'              => true,

    /*
     * --------------------------------------------------------------------------
     * Add your policy class here.
     * --------------------------------------------------------------------------
     */
    'env_editor_policy'        => '',

    /*
     * --------------------------------------------------------------------------
     * DataTables state saving.
     * --------------------------------------------------------------------------
     */
    'state_datatables'         => true,

    /*
     * --------------------------------------------------------------------------
     * Tabs state remember.
     * --------------------------------------------------------------------------
     */
    'state_tabs'               => false,

    /*
     * --------------------------------------------------------------------------
     * Filters state remember in DataTables.
     * --------------------------------------------------------------------------
     */
    'state_filters'            => false,

    /*
    |--------------------------------------------------------------------------
    | Authentication default provider
    |--------------------------------------------------------------------------
    |
    | @see config/auth.php : providers
    |
    */

    'auth_provider' => 'users',

    /*
    |--------------------------------------------------------------------------
    |  Path to admin bootstrap files directory
    |--------------------------------------------------------------------------
    |
    | Default: app_path('Admin')
    |
    */

    'bootstrapDirectory' => app_path('Admin'),

    /*
    |--------------------------------------------------------------------------
    |  Directory for uploaded images (relative to `public` directory)
    |--------------------------------------------------------------------------
    */

    'imagesUploadDirectory' => 'images/uploads',

    /*
    |--------------------------------------------------------------------------
    |  Use LazyLoad for AdminColumn::image in tables
    |  in `imageLazyLoadFile` insert path to file or `data:image/gif;base64,...`
    |--------------------------------------------------------------------------
    */

    'imageLazyLoad'     => false,
    'imageLazyLoadFile' => 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',

    /*
    |--------------------------------------------------------------------------
    |  Allowed Extensions for uploaded images - array
    |--------------------------------------------------------------------------
    */

    'imagesAllowedExtensions' => [
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
        'ico', 'jpe',
    ],

    /*
    |--------------------------------------------------------------------------
    |  Allow to upload svg-files without required xml-header as image - boolean
    |--------------------------------------------------------------------------
    */

    'imagesAllowSvg' => false,

    /*
    |--------------------------------------------------------------------------
    |  Behavoir if file exists (default 'UPLOAD_HASH'). See in UploadController
    |--------------------------------------------------------------------------
    */

    'imagesUploadFilenameBehavior' => 'UPLOAD_HASH',

    /*
    |--------------------------------------------------------------------------
    |  Directory for uploaded files (relative to `public` directory)
    |--------------------------------------------------------------------------
    */

    'filesUploadDirectory' => 'files/uploads',

    /*
    |--------------------------------------------------------------------------
    |  Allowed Extensions for uploaded files - array
    |--------------------------------------------------------------------------
    */

    'filesAllowedExtensions' => [],

    /*
    |--------------------------------------------------------------------------
    |  Behavoir if file exists (default 'UPLOAD_HASH'). See in UploadController
    |--------------------------------------------------------------------------
    */

    'filesUploadFilenameBehavior' => 'UPLOAD_HASH',

    /*
    |--------------------------------------------------------------------------
    |  Admin panel template
    |--------------------------------------------------------------------------
    */

    'template' => SleepingOwl\Admin\Templates\TemplateDefault::class,

    /*
    |--------------------------------------------------------------------------
    |  Default date and time formats
    |--------------------------------------------------------------------------
    */

    'datetimeFormat' => 'd-m-Y H:i',
    'dateFormat'     => 'd-m-Y',
    'timeFormat'     => 'H:i',
    'timezone'       => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Use Card
    |--------------------------------------------------------------------------
    |
    | Using default cards views.
    |
    */

    'useWysiwygCard'    => false,
    'useRelationCard'    => false,
    'useHasManyLocalCard'    => false,

    /*
    |--------------------------------------------------------------------------
    | Editors
    |--------------------------------------------------------------------------
    |
    | Select default editor and tweak options if needed.
    |
    */

    'wysiwyg'                => [
        'default'    => 'ckeditor',

        /*
         * See http://docs.ckeditor.com/#!/api/CKEDITOR.config
         */
        'ckeditor'   => [
            'defaultLanguage' => config('app.locale'),
            'height'          => 200,
            'allowedContent'  => true,
            'extraPlugins'    => 'uploadimage,image2,justify,youtube,uploadfile',
            /*
             * WARNING!!!! CKEDITOR on D & D and UploadImageDialog
             * BY DEFAULT IMAGES WILL STORE TO imagesUploadDirectory = /images/uploads
             * 'uploadUrl'            => '/path/to/your/action',
             * 'filebrowserUploadUrl' => '/path/to/your/action',
             */

        ],

        /*
         * See https://www.tinymce.com/docs/
         */
        'tinymce'    => [
            'height' => 200,
        ],

        /*
         * See https://github.com/NextStepWebs/simplemde-markdown-editor
         */
        'simplemde'  => [
            'hideIcons' => ['side-by-side', 'fullscreen'],
        ],

        /*
        * ver. 0.8.12
        * See https://summernote.org/
        * Need jQuery
        */
        'summernote' => [
            'height'     => 200,
            'lang'       => 'ru-RU',
            'codemirror' => [
                'theme' => 'monokai',
            ],
        ],

        /*
         * See https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/configuration.html
         *
         * For using CKFinder with CKEditor 5 you must load additional js-file, see /app/Admin/bootstrap.php
         * See https://ckeditor.com/docs/ckeditor5/latest/features/image-upload/ckfinder.html#configuring-the-full-integration
         *
         * Be careful: CKEditor 5 haven't html source code button feature!
         * See https://github.com/ckeditor/ckeditor5/issues/592
         */
        'ckeditor5'  => [
            'files' => [
                /*
                 * Use Classic build from CDN - provides a limited number of components and capabilities
                 * See https://ckeditor.com/ckeditor-5/download/
                 */
                //'editor' => '//cdn.ckeditor.com/ckeditor5/27.1.0/classic/ckeditor.js',
                //'translation' => '//cdn.ckeditor.com/ckeditor5/27.1.0/classic/translations/'.config('app.locale').'.js',
                /*
                 * Use Custom build with most-used additional plugins
                 * See https://ckeditor.com/ckeditor-5/online-builder/
                 */
                'editor'      => '/packages/sleepingowl/ckeditor5/build/ckeditor.js',
                'translation' => '/packages/sleepingowl/ckeditor5/build/translations/'.config('app.locale').'.js',
            ],

            'language'      => config('app.locale'),

            // Text alignment options
            'alignment'     => [
                'options' => [
                    'left', 'center', 'right', /*'justify',*/
                ],
            ],

            // Uncomment some plugins if you need to enable them
            'removePlugins' => [
                // See https://ckeditor.com/docs/ckeditor5/latest/api/module_heading_title-Title.html
                'Title',
                // See https://ckeditor.com/docs/ckeditor5/latest/features/lists/lists.html#list-styles
                'ListStyle',
                // See https://ckeditor.com/docs/ckeditor5/latest/features/markdown.html
                'Markdown',
            ],

            // Toolbar components
            'toolbar'       => [
                // Active toolbar components
                'undo', 'redo', '|',
                'heading', '|',
                'bold', 'italic', 'alignment', 'fontColor', 'blockQuote', 'link', 'bulletedList', 'numberedList', 'removeFormat', '|',
                'insertImage', 'mediaEmbed', 'insertTable', '|',

                // All available toolbar components:
                /*
                'heading',
                'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript',
                'alignment', 'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', 'highlight',
                'link', 'bulletedList', 'numberedList', 'outdent', 'indent',
                'imageUpload', 'imageInsert', 'mediaEmbed', 'insertTable', 'blockQuote', 'htmlEmbed',
                'textPartLanguage', 'codeBlock', 'code', 'pageBreak', 'horizontalLine', 'specialCharacters',
                'undo', 'redo', 'removeFormat', '|',
                */
            ],

            // Images options
            'image'         => [
                'styles'  => [
                    'alignLeft', 'alignCenter', 'alignRight', 'full', 'side',
                ],
                'toolbar' => [
                    'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight', '|',
                    'imageTextAlternative', '|', 'link',
                ],
            ],

            // Tables options
            'table'         => [
                'contentToolbar' => [
                    'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties',
                ],
            ],

            // Media embed options
            'mediaEmbed'    => [
                'toolbar'         => ['mediaEmbed'],
                /**
                 * @see https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html#including-previews-in-data
                 * @see https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html#displaying-embedded-media-on-your-website
                 */
                'previewsInData'  => true,
                /**
                 * The names of providers with rendering functions (previews): dailymotion, spotify, youtube, vimeo.
                 *
                 * @see https://ckeditor.com/docs/ckeditor5/latest/api/module_media-embed_mediaembed-MediaEmbedConfig.html#member-providers
                 *
                 * So, we need to remove providers without rendering function
                 * @see https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html#removing-media-providers
                 */
                'removeProviders' => ['instagram', 'twitter', 'googleMaps', 'flickr', 'facebook'],
            ],

            'uploadUrl'            => '/storage/images_admin',
            'filebrowserUploadUrl' => '/storage/images_admin',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | DataTables
    |--------------------------------------------------------------------------
    |
    | Select default settings for datatable
    |
    */
    'datatables'             => [],

    /*
    |--------------------------------------------------------------------------
    | DataTables column highlight
    |--------------------------------------------------------------------------
    |
    | Highlight DataTables column on mouseover
    |
    */
    'datatables_highlight'   => false,

    /*
    |--------------------------------------------------------------------------
    | Breadcrumbs
    |--------------------------------------------------------------------------
    |
    */
    'breadcrumbs'            => true,

    /*
    |--------------------------------------------------------------------------
    | Autoupdate datatables
    |--------------------------------------------------------------------------
    |
    | Interval in minutes. Do not set too low.
    | dt_autoupdate_interval >= 1 and (int)
    | dt_autoupdate_class - custom class if need (can be null)
    | dt_autoupdate_color - color ProgressBar (can be null)
    |
    */
    'dt_autoupdate'          => false,
    'dt_autoupdate_interval' => 5, //minutes
    'dt_autoupdate_class'    => '',
    'dt_autoupdate_color'    => '#dc3545',

    /*
    |--------------------------------------------------------------------------
    | Add scrolls button
    |--------------------------------------------------------------------------
    |
    */

    'scroll_to_top'    => true,
    'scroll_to_bottom' => true,

    /*
    |--------------------------------------------------------------------------
    | Class Aliases
    |--------------------------------------------------------------------------
    |
    | This array of class aliases will be registered when this application
    | is started.
    |
    */

    'aliases' => [
        // Components
        'Assets'              => KodiCMS\Assets\Facades\Assets::class,
        'PackageManager'      => KodiCMS\Assets\Facades\PackageManager::class,
        'Meta'                => KodiCMS\Assets\Facades\Meta::class, // will destroy
        'Form'                => Collective\Html\FormFacade::class,
        'HTML'                => Collective\Html\HtmlFacade::class,
        'WysiwygManager'      => SleepingOwl\Admin\Facades\WysiwygManager::class,
        'MessagesStack'       => SleepingOwl\Admin\Facades\MessageStack::class,

        // Presenters
        'AdminSection'        => SleepingOwl\Admin\Facades\Admin::class,
        'AdminTemplate'       => SleepingOwl\Admin\Facades\Template::class,
        'AdminNavigation'     => SleepingOwl\Admin\Facades\Navigation::class,
        'AdminColumn'         => SleepingOwl\Admin\Facades\TableColumn::class,
        'AdminColumnEditable' => SleepingOwl\Admin\Facades\TableColumnEditable::class,
        'AdminColumnFilter'   => SleepingOwl\Admin\Facades\TableColumnFilter::class,
        'AdminDisplayFilter'  => SleepingOwl\Admin\Facades\DisplayFilter::class,
        'AdminForm'           => SleepingOwl\Admin\Facades\Form::class,
        'AdminFormElement'    => SleepingOwl\Admin\Facades\FormElement::class,
        'AdminDisplay'        => SleepingOwl\Admin\Facades\Display::class,
        'AdminWidgets'        => SleepingOwl\Admin\Facades\Widgets::class,
    ],
];

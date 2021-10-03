<?php

return [
    'dashboard' => 'Dashboard',
    '404'       => 'Page not found.',

    'auth'      => [
        'title'           => 'Authorization',
        'username'        => 'Username',
        'password'        => 'Password',
        'login'           => 'Login',
        'logout'          => 'Logout',
        'wrong-username'  => 'Wrong username',
        'wrong-password'  => 'or password',
        'since'           => 'Registered at :date',
    ],

    'model' => [
        'create'  => 'Create record in section :title',
        'edit'    => 'Update record in section :title',
    ],

    'links' => [
        'index_page' => 'To site',
    ],

    'env_editor' => [
        'title' => 'ENV-editor',
        'key' => 'Key',
        'var' => 'Value',
    ],

    'ckeditor' => [
        'upload' => [
            'success' => 'File was uploaded: \\n- Size: :size kb \\n- width/height: :width x :height',

            'error' => [
                'common' => 'Unable to upload the file.',
                'wrong_extension' => 'File ":file" has wrong extension.',
                'filesize_limit' => 'Maximum allowed file size is :size kb.',
                'filesize_limit_m' => 'Maximum allowed file size is :size Mb.',
                'imagesize_max_limit' => 'Width x Height = :width x :height \\n The maximum Width x Height must be: :maxwidth x :maxheight',
                'imagesize_min_limit' => 'Width x Height = :width x :height \\n The minimum Width x Height must be: :minwidth x :minheight',
            ],
        ],

        'image_browser' => [
            'title' => 'Insert image from server',
            'subtitle' => 'Choose image to insert',
        ],
    ],

    'table' => [
        'no-action' => 'No action',
        'deleted_all' => 'Delete selected',
        'make-action' => 'Submit',
        'delete-confirm' => 'Are you sure want to delete this entry?',
        'action-confirm' => 'Are you sure want to make this action?',
        'delete-error' => 'Error while deleting this entry. You must delete all linked entries first.',
        'destroy-confirm' => 'Are you sure want to permanently delete this entry?',
        'destroy-error' => 'Error while permanently deleting this entry. You must delete all linked entries first.',
        'error' => 'There was an error during your request',
        'filter' => 'Show similar entries',
        'filter-goto' => 'Show',
        'save' => 'Save',
        'all' => 'All',
        'processing' => '<i class="fas fa-spinner fa-5x fa-spin"></i>',
        'loadingRecords' => 'Loading...',
        'lengthMenu' => 'Show _MENU_ entries',
        'zeroRecords' => 'No matching records found.',
        'info' => 'Showing _START_ to _END_ of _TOTAL_ entries',
        'infoEmpty' => 'No entries',
        'infoFiltered' => '(filtered from _MAX_ total entries)',
        'infoThousands' => ',',
        'infoPostFix' => '',
        'search' => 'Search ',
        'emptyTable' => 'No data available in table',

        'paginate' => [
            'first' => 'First',
            'previous' => '&larr;',
            'next' => '&rarr;',
            'last' => 'Last',
        ],

        'filters' => [
            'control' => 'Filter',
        ],
    ],

    'tree' => [
        'expand' => 'Expand all',
        'collapse' => 'Collapse all',
    ],

    'editable' => [
        'checkbox' => [
            'checked' => 'Yes',
            'unchecked' => 'No',
        ],
    ],

    'select' => [
        'nothing' => 'Nothing selected',
        'selected' => 'selected',
        'placeholder' => 'Select from the list',
        'no_items'    => 'No items',
        'init'        => 'Select',
        'empty'       => 'empty',
        'limit'       => 'and ${count} more',
        'more'       => 'and :count more',
        'deselect'    => 'Deselect',
        'short'       => 'Enter min :min characters',
    ],

    'image' => [
        'browse' => 'Select Image',
        'browseMultiple' => 'Select Images',
        'remove' => 'Remove Image',
        'removeMultiple' => 'Remove Images',
    ],

    'file' => [
        'browse' => 'Select File',
        'browseMultiple' => 'Select Files',
        'remove' => 'Remove File',
        'insert_link' => 'Insert link',
    ],

    'button' => [
        'yes'       => 'Yes',
        'no'        => 'No',
        'cancel'    => 'Cancel',
        'save' => 'Save',
        'new-entry' => 'New Entry',
        'edit' => 'Edit',
        'restore' => 'Restore',
        'delete' => 'Delete',
        'destroy' => 'Destroy',
        'save_and_close' => 'Save and close',
        'save_and_create' => 'Save and create',
        'moveUp' => 'Move Up',
        'moveDown' => 'Move Down',
        'download' => 'Download',
        'add' => 'Add',
        'remove' => 'Remove',
        'clear' => 'Clear',
    ],

    'message' => [
        'created' => 'Record has been created successfully',
        'updated' => 'Record has been updated successfully',
        'deleted' => 'Record has been deleted successfully',
        'destroyed' => 'Record has been destroyed successfully',
        'restored' => 'Record has been restored successfully',
        'something_went_wrong' => 'Something went wrong!',
        'are_you_sure' => 'Are you sure?',
        'access_denied' => 'Access denied',
        'validation_error' => 'Validation error',
    ],

    'related' => [
        'unique' => 'This relation not unique',
    ],

    'seo' => [
        'title' => 'Title',
        'description' => 'Description',
    ],
];

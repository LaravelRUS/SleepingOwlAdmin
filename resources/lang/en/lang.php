<?php

return [
    'dashboard' => 'Dashboard',
    '404' => 'Page not found.',
    'auth' => [
        'title' => 'Authorization',
        'username' => 'Username',
        'password' => 'Password',
        'login' => 'Login',
        'logout' => 'Logout',
        'wrong-username' => 'Wrong username',
        'wrong-password' => 'or password',
        'since' => 'Registered at :date',
    ],
    'model' => [
        'create' => 'Create record in section :title',
        'edit' => 'Update record in section :title',
    ],
    'links' => [
        'index_page' => 'To site',
    ],
    'ckeditor' => [
        'upload' => [
            'success' => 'File was uploaded: \\n- Size: :size kb \\n- width/height: :width x :height',
            'error' => [
                'common' => 'Unable to upload the file.',
                'wrong_extension' => 'File ":file" has wrong extension.',
                'filesize_limit' => 'Maximum allowed file size is :size kb.',
                'imagesize_max_limit' => 'Width x Height = :width x :height \\n The maximum Width x Height must be: :maxwidth x :maxheight',
                'imagesize_min_limit' => 'Width x Height = :width x :height \\n The minimum Width x Height must be: :minwidth x :minheight',
            ],
        ],
        'image_browser' => [
            'title' => 'Insert image from server',
            'subtitle' => 'Choose image to insert',
        ],
    ],
    'env_editor' => [
        'title' => 'Environment variables editor',
        'key' => 'Key',
        'new-entry' => 'New Entry',
        'save' => 'Save',
        'var' => 'Variable',
    ],
    'table' => [
        'no-action' => 'No action',
        'make-action' => 'Submit',
        'new-entry' => 'New Entry',
        'edit' => 'Edit',
        'restore' => 'Restore',
        'delete' => 'Delete',
        'delete-confirm' => 'Are you sure want to delete this entry?',
        'action-confirm' => 'Are you sure want to make this action?',
        'delete-error' => 'Error while deleting this entry. You must delete all linked entries first.',
        'destroy' => 'Destroy',
        'destroy-confirm' => 'Are you sure want to permanently delete this entry?',
        'destroy-error' => 'Error while permanently deleting this entry. You must delete all linked entries first.',
        'moveUp' => 'Move Up',
        'moveDown' => 'Move Down',
        'error' => 'There was an error during your request',
        'filter' => 'Show similar entries',
        'filter-goto' => 'Show',
        'save' => 'Save',
        'save_and_close' => 'Save and close',
        'save_and_create' => 'Save and create',
        'cancel' => 'Cancel',
        'download' => 'Download',
        'all' => 'All',
        'processing' => '<i class="fa fa-5x fa-spinner fa-spin"></i>',
        'loadingRecords' => 'Loading...',
        'lengthMenu' => 'Show _MENU_ entries',
        'zeroRecords' => 'No matching records found.',
        'info' => 'Showing _START_ to _END_ of _TOTAL_ entries',
        'infoEmpty' => 'Showing 0 to 0 of 0 entries',
        'infoFiltered' => '(filtered from _MAX_ total entries)',
        'infoThousands' => ',',
        'infoPostFix' => '',
        'search' => 'Search: ',
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
        'limit'       => 'and ${count} more',
        'deselect'    => 'Deselect',
    ],
    'image' => [
        'browse' => 'Select Image',
        'browseMultiple' => 'Select Images',
        'remove' => 'Remove Image',
        'removeMultiple' => 'Remove',
    ],
    'file' => [
        'browse' => 'Select File',
        'remove' => 'Remove File',
    ],
    'button' => [
        'yes' => 'Yes',
        'no' => 'No',
        'cancel' => 'Cancel',
    ],
    'message' => [
        'created' => '<i class="fa fa-check fa-lg"></i> Record has been created successfully',
        'updated' => '<i class="fa fa-check fa-lg"></i> Record has been updated successfully',
        'deleted' => '<i class="fa fa-check fa-lg"></i> Record has been deleted successfully',
        'destroyed' => '<i class="fa fa-check fa-lg"></i> Record has been destroyed successfully',
        'restored' => '<i class="fa fa-check fa-lg"></i> Record has been restored successfully',
        'something_went_wrong' => 'Something went wrong!',
        'are_you_sure' => 'Are you sure?',
        'access_denied' => 'Access denied',
        'validation_error' => 'Validation error',
    ],
    'related' => [
        'add' => 'Add',
        'remove' => 'Remove',
    ],
];

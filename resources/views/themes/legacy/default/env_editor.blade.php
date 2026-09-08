@stack('block.top')

<div class="row">
    <div class="col-md-3 col-sm-6 col-xs-12">
        @stack('block.top.column.left')
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
        @stack('block.top.column.right')
    </div>
</div>
@php
    $envEditorProps = array_replace([
        'action' => route('admin.env.editor.post'),
        'canAdd' => (bool) config('sleeping_owl.env_can_add'),
        'canDelete' => (bool) config('sleeping_owl.env_can_delete'),
        'classes' => [
            'addButton' => 'btn btn-primary text-white',
            'addIcon' => 'fas fa-plus',
            'card' => 'card card-default',
            'cardHeading' => 'card-heading',
            'footer' => 'card-footer',
            'header' => 'row-header',
            'keyCell' => 'row-link',
            'keyInput' => 'form-control env-key',
            'links' => 'links-row',
            'removeButton' => 'btn btn-xs btn-danger text-white env-remove',
            'removeCell' => 'row-link align-middle',
            'removeIcon' => 'fas fa-times',
            'removeWrapper' => 'float-end',
            'row' => 'env-row',
            'saveButton' => 'btn btn-primary',
            'saveIcon' => 'fas fa-check',
            'saveWrapper' => 'float-end',
            'table' => 'table table-striped',
            'valueCell' => 'row-datetime',
            'valueInput' => 'form-control env-value',
        ],
        'csrfToken' => csrf_token(),
        'data' => $data,
        'errorText' => trans('sleeping_owl::validation.access_denied'),
        'keysReadonly' => (bool) config('sleeping_owl.env_keys_readonly'),
        'labels' => [
            'add' => trans('sleeping_owl::lang.button.new-entry'),
            'key' => trans('sleeping_owl::lang.env_editor.key'),
            'remove' => trans('sleeping_owl::lang.button.remove'),
            'save' => trans('sleeping_owl::lang.button.save'),
            'value' => trans('sleeping_owl::lang.env_editor.var'),
        ],
    ], $envEditorExtraProps ?? []);
@endphp

<div
    v-pre
    data-vue-app
    data-vue-component="env_editor"
    data-vue-props="{{ json_encode($envEditorProps, JSON_THROW_ON_ERROR) }}"
></div>
<div class="row">
    <div class="col-md-8">
        @stack('block.content.column.left')
    </div>
    <div class="col-md-4">
        @stack('block.content.column.right')
    </div>
</div>

@stack('block.footer')

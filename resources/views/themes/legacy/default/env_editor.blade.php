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
    $envEditorProps = [
        'action' => route('admin.env.editor.post'),
        'canAdd' => (bool) config('sleeping_owl.env_can_add'),
        'canDelete' => (bool) config('sleeping_owl.env_can_delete'),
        'csrfToken' => csrf_token(),
        'data' => $data,
        'errorText' => trans('sleeping_owl::validation.access_denied'),
        'keysReadonly' => (bool) config('sleeping_owl.env_keys_readonly'),
        'labels' => [
            'add' => trans('sleeping_owl::lang.button.new-entry'),
            'key' => trans('sleeping_owl::lang.env_editor.key'),
            'save' => trans('sleeping_owl::lang.button.save'),
            'value' => trans('sleeping_owl::lang.env_editor.var'),
        ],
    ];
@endphp

<div
    data-soa-vue-app
    data-soa-vue-component="env_editor"
    data-soa-vue-props="{{ json_encode($envEditorProps, JSON_THROW_ON_ERROR) }}"
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

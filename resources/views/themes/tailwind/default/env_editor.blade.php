@stack('block.top')

<div class="row soa-dashboard-grid soa-dashboard-grid-top">
    <div class="col-md-3 col-sm-6 col-xs-12 soa-dashboard-column soa-dashboard-column-quarter">
        @stack('block.top.column.left')
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12 soa-dashboard-column soa-dashboard-column-quarter">
        @stack('block.top.column.right')
    </div>
</div>
@php
    $envEditorProps = array_replace([
        'action' => route('admin.env.editor.post'),
        'canAdd' => (bool) config('sleeping_owl.env_can_add'),
        'canDelete' => (bool) config('sleeping_owl.env_can_delete'),
        'classes' => [
            'addButton' => 'btn btn-primary text-white soa-button soa-button-primary',
            'addIcon' => 'fas fa-plus',
            'card' => 'card soa-card soa-env-card',
            'cardHeading' => 'card-header soa-card-header soa-env-card-heading',
            'footer' => 'card-footer soa-card-footer soa-env-footer',
            'header' => 'row-header soa-env-header',
            'keyCell' => 'row-link soa-env-key-cell',
            'keyInput' => 'form-control env-key soa-input',
            'links' => 'links-row soa-env-links',
            'removeButton' => 'btn btn-sm btn-danger text-white env-remove soa-button soa-button-sm soa-button-danger',
            'removeCell' => 'row-link align-middle soa-env-remove-cell',
            'removeIcon' => 'fas fa-times',
            'removeWrapper' => 'float-end soa-env-action',
            'row' => 'env-row soa-env-row',
            'saveButton' => 'btn btn-primary soa-button soa-button-primary',
            'saveIcon' => 'fas fa-check',
            'saveWrapper' => 'float-end soa-env-action',
            'table' => 'table table-striped soa-table soa-env-table',
            'valueCell' => 'row-datetime soa-env-value-cell',
            'valueInput' => 'form-control env-value soa-input',
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
<div class="row soa-dashboard-grid soa-dashboard-grid-content">
    <div class="col-md-8 soa-dashboard-column soa-dashboard-column-wide">
        @stack('block.content.column.left')
    </div>
    <div class="col-md-4 soa-dashboard-column soa-dashboard-column-narrow">
        @stack('block.content.column.right')
    </div>
</div>

@stack('block.footer')

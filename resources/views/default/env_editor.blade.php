@stack('block.top')

<div class="row">
    <div class="col-md-3 col-sm-6 col-xs-12">
        @stack('block.top.column.left')
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
        @stack('block.top.column.right')
    </div>
</div>
<env_editor :data="{{ json_encode($data) }}" :error-text="'{{ trans('sleeping_owl::validation.access_denied') }}'" inline-template>
    {{ Form::open(['method' => 'POST', 'url' => route('admin.env.editor.post')]) }}
    <div class="links-row"></div>
    <div class="panel panel-default">
        <div class="panel-heading">
        </div>
        <table class="table table-striped" id="env_editor_table">
            <thead>
            <tr>
                <th class="row-header">
                    {{trans('sleeping_owl::lang.env_editor.key')}}
                </th>
                <th class="row-header">
                    {{trans('sleeping_owl::lang.env_editor.var')}}
                </th>
                <th class="row-header">
                </th>
            </tr>
            </thead>
            <thead class="table table-striped table table-striped">
            <tr></tr>
            </thead>
            <tbody>
            <tr v-for="(value, key) in values">
                <td class="row-link">
                    <input type="text" :name="'variables[' + value.key + '][key]'" v-model="value.key"
                           :value="value.key" :readonly="!value.editable"
                           class="form-control">
                </td>
                <td class="row-datetime">
                    <input type="text" :name="'variables[' + value.key + '][value]'" v-model="value.value"
                           :value="value.value" :readonly="!value.editable"
                           class="form-control">
                </td>
                <td class="row-link" style="vertical-align: inherit;">
                    <div class="pull-right">
                        <a title="delete" @click="removeEnv(key)" class="btn btn-xs btn-danger">
                            <i class="fa fa-times"></i>
                        </a>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="panel-footer">
            <a id="env_add_entry" @click="values.push({key:null, value:null})" class="btn btn-primary">
                <i class="fa fa-plus"></i> {{trans('sleeping_owl::lang.env_editor.new-entry')}}
            </a>
            <div class="pull-right">
                <button class="btn btn-primary" type="submit">
                    <i class="fa fa-check"></i> {{trans('sleeping_owl::lang.env_editor.save')}}
                </button>
            </div>
        </div>
    </div>
    {{ Form::close() }}
</env_editor>
<div class="row">
    <div class="col-md-8">
        @stack('block.content.column.left')
    </div>
    <div class="col-md-4">
        @stack('block.content.column.right')
    </div>
</div>

@stack('block.footer')

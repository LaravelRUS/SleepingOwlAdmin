<related-group
    name="{{ $name }}"
    :index="{{ isset($index) ? $index : 'undefined'}}"
    primary="{{ trim((string)$group->getPrimary()) }}"
    label="{{ $group->getLabel() }}"
    :removed="removed.indexOf('{{ (string)$group->getPrimary() }}') !== -1"
    @remove="removeGroup"
    inline-template
>
    <div class="grouped-element" v-if="!removed">
        <div class='grouped-element__head' v-if="label">
            <span><b>{{ $group->getLabel() }}</b></span>
        </div>
        <div class='grouped-element__body'>
            @foreach ($group as $item)
                @if($item instanceof \Illuminate\Contracts\Support\Renderable)
                    {!! $item->render() !!}
                @else
                    {!! $item !!}
                @endif
            @endforeach
        </div>
        <div class='grouped-element__footer form-group clearfix'>
            <button type='button'
                    v-if="canRemove"
                    @click="handleRemove"
                    data-original-text='Удалить'
                    data-toggle='tooltip'
                    class='btn btn-warning pull-right btn-sm grouped-element__delete'>
                <i class='fas fa-trash'></i>
                {{ trans('sleeping_owl::lang.button.remove') }}
            </button>
        </div>
        <hr class="grouped-element__hr" />
    </div>
</related-group>

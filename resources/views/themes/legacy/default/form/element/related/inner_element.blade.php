@php
    $relatedGroupView = AdminTemplate::getViewPath('form.element.related.group');
    $relatedGroupContext = [
        'deletable' => (bool) $deletable,
        'draggable' => (bool) ($draggable ?? false),
        'readonly' => (bool) $readonly,
    ];
    $relatedGroups = [];

    foreach ($groups as $key => $group) {
        $relatedGroups[] = [
            'html' => view($relatedGroupView, [...$relatedGroupContext, 'group' => $group])->render(),
            'index' => $key,
            'primary' => trim((string) $group->getPrimary()),
        ];
    }

    $stubGroup = new \SleepingOwl\Admin\Form\Related\Group(null, $stub->all());
    $relatedProps = array_replace([
        'classes' => [
            'actions' => 'd-block clearfix',
            'add' => 'grouped-elements__action pull-right related-action_add btn btn-success btn-sm',
            'addIcon' => 'fas fa-plus',
            'groups' => 'related-elements__draggable',
            'root' => 'grouped-elements clearfix',
        ],
        'draggable' => (bool) ($draggable ?? false),
        'groups' => $relatedGroups,
        'labels' => ['add' => trans('sleeping_owl::lang.button.add')],
        'limit' => is_null($limit) ? null : (int) $limit,
        'name' => (string) $name,
        'readonly' => (bool) $readonly,
        'removed' => array_values(array_map('strval', $remove->all())),
        'stubHtml' => view($relatedGroupView, [...$relatedGroupContext, 'group' => $stubGroup])->render(),
    ], $relatedExtraProps ?? []);
    $relatedPropsId = 'soa-related-props-' . \Illuminate\Support\Str::uuid();
@endphp

<script id="{{ $relatedPropsId }}" type="application/json">{!! \Illuminate\Support\Js::encode($relatedProps) !!}</script>
<div
    v-pre
    data-vue-app
    data-vue-component="related-elements"
    data-vue-props-id="{{ $relatedPropsId }}"
></div>

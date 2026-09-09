@php($groupLabel = $group->getLabel())
<div class="grouped-element" data-related-group>
        @if ($groupLabel)
          <div class="grouped-element__head">
            <span><b>{{ $groupLabel }}</b></span>
          </div>
        @endif
        <div class="grouped-element__body">
            @foreach ($group as $item)
                @if($item instanceof \Illuminate\Contracts\Support\Renderable)
                    {!! $item->render() !!}
                @else
                    {!! $item !!}
                @endif
            @endforeach
        </div>

        @if (!$readonly)
          <div class="grouped-element__footer form-group mb-3 clearfix">
            @if (isset($draggable) && $draggable)
              <a class="btn btn-clear btn-sm float-start me-1 drag-cursor drag-handle">
                <i class="fas fa-fw fa-arrows-alt" aria-hidden="true"></i>
              </a>
            @endif

            @if ($deletable)
              <button
                type="button"
                data-related-remove
                data-original-text="{{ trans('sleeping_owl::lang.button.remove') }}"
                data-toggle="tooltip"
                data-bs-toggle="tooltip"
                class="btn btn-warning float-end btn-sm grouped-element__delete"
              >
                <i class="fas fa-trash" aria-hidden="true"></i>
                {{ trans('sleeping_owl::lang.button.remove') }}
              </button>
            @endif

          </div>
        @endif

        <hr class="grouped-element__hr" />
</div>

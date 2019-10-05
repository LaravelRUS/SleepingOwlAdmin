<div {!! $attributes !!}>
  @foreach($buttons as $button)
    {!! $button->render() !!}
  @endforeach
  @if($model && $model->deleted_at)
    <span class="model_deleted" style="display:none"></span>
  @endif
</div>

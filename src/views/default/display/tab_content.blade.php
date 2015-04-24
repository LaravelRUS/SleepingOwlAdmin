<div role="tabpanel" class="tab-pane {!! ($active) ? 'in active' : '' !!}" id="{{ $name }}">
	{!! $content->render() !!}
</div>
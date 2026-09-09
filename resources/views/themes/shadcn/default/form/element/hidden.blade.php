@if ($visibled)
  <input v-pre {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!} value="{{ $value }}" />
@endif

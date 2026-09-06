@php
    $themeClasses = match ($name) {
        'save_and_continue' => ['btn', 'btn-primary'],
        'save_and_close' => ['btn', 'btn-success'],
        'save_and_create' => ['btn', 'btn-info'],
        'delete', 'destroy' => ['btn', 'btn-danger'],
        'cancel', 'restore' => ['btn', 'btn-warning'],
        default => ['btn'],
    };
    $buttonAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class($themeClasses);
@endphp
@if(!$url)
    <button {!! $buttonAttributes !!} value="{{$name}}">
        @if($iconClass)<i class="{{ $iconClass }}"></i>@endif {{$text}}
    </button>
@else
    <a href="{{$url}}" {!! $buttonAttributes !!}>
        @if($iconClass)<i class="{{$iconClass}}"></i>@endif {{ $text }}
    </a>
@endif
@if($groupElements)
    <div class="btn-group">
        <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
        </button>
        <div class="dropdown-menu btn-actions">
            <div class="btn-group-vertical">
                @foreach($groupElements as $groupButton)
                    @if($groupButton instanceof \SleepingOwl\Admin\Form\Buttons\FormButton && $groupButton->getShow())
                        {!! $groupButton->render() !!}
                    @endif
                @endforeach
            </div>
        </div>
    </div>
@endif

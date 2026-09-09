@php
    $themeClasses = match ($name) {
        'save_and_continue' => ['btn', 'btn-primary', 'soa-button', 'soa-button-primary'],
        'save_and_close' => ['btn', 'btn-success', 'soa-button', 'soa-button-success'],
        'save_and_create' => ['btn', 'btn-info', 'soa-button', 'soa-button-info'],
        'delete', 'destroy' => ['btn', 'btn-danger', 'soa-button', 'soa-button-danger'],
        'cancel', 'restore' => ['btn', 'btn-warning', 'soa-button', 'soa-button-warning'],
        default => ['btn', 'soa-button', 'soa-button-secondary'],
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
    <div class="btn-group soa-button-group">
        <button type="button" class="btn dropdown-toggle soa-button soa-button-secondary soa-icon-button" data-toggle="dropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
        </button>
        <div class="dropdown-menu btn-actions soa-dropdown-menu">
            <div class="btn-group-vertical soa-button-group soa-button-group-vertical">
                @foreach($groupElements as $groupButton)
                    @if($groupButton instanceof \SleepingOwl\Admin\Form\Buttons\FormButton && $groupButton->getShow())
                        {!! $groupButton->render() !!}
                    @endif
                @endforeach
            </div>
        </div>
    </div>
@endif

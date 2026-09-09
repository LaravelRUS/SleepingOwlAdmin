@php($emptyContent = $content ?? trans('sleeping_owl::lang.table.emptyTable'))
@if(isset($colspan))
    <tr class="soa-empty-row">
        <td class="soa-empty" colspan="{{ $colspan }}">
            @if(!empty($icon))<i class="{{ $icon }}" aria-hidden="true"></i>@endif
            <span>{!! $emptyContent !!}</span>
        </td>
    </tr>
@else
    <div class="soa-empty" role="status">
        @if(!empty($icon))<i class="{{ $icon }}" aria-hidden="true"></i>@endif
        <span>{!! $emptyContent !!}</span>
    </div>
@endif

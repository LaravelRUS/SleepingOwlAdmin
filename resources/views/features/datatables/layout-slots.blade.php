@if (! empty($datatableLayoutSlots) && ! empty($attributesArray['data-id']))
	<div
		data-admin-datatables-layout-slots
		data-datatables-id="{{ $attributesArray['data-id'] }}"
		hidden
	>
		@foreach ($datatableLayoutSlots as $position => $blocks)
			<div
				class="soa-dt-layout-slot"
				data-admin-datatables-layout-slot="{{ $position }}"
			>
				@foreach ($blocks as $block)
					{!! $block !!}
				@endforeach
			</div>
		@endforeach
	</div>
@endif

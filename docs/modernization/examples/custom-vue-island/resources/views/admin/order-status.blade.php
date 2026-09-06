@php($propsId = 'order-status-'.$order->getKey().'-props')

<script id="{{ $propsId }}" type="application/json">
    {!! \Illuminate\Support\Js::encode([
        'orderId' => $order->getKey(),
        'status' => $order->status,
    ]) !!}
</script>
<section
    v-pre
    data-soa-vue-app
    data-soa-vue-component="order-status"
    data-soa-vue-props-id="{{ $propsId }}"
></section>

<template>
    <button type="button" @click="toggle">
        Order #{{ orderId }}: {{ currentStatus }}
    </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    orderId: { required: true, type: Number },
    status: { default: 'pending', type: String },
})
const currentStatus = ref(props.status)

function toggle() {
    currentStatus.value = currentStatus.value === 'pending' ? 'ready' : 'pending'
}
</script>

<template>
    <div class="w-full bg-transparent">
        <div class="h-1 bg-sky-400" :style="{ width: width }"></div>
    </div>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { defineProps } from 'vue';
const props = defineProps({ value: Number, status: Object });

const width = computed(() => `${props.value}%`)
</script>
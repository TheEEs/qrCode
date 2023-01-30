<template>
    <template v-if="props.show">
        <div class="w-full h-screen bg-slate-400 fixed">
            HEHEHE
        </div>
    </template>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps(['show'])
</script>
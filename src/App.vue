<template>
  <div class="font-open-sans">
    <router-view v-slot="{Component}">
      <transition mode="out-in" enter-active-class="animate__animated animate__fadeInRight animate__faster" leave-active-class="animate__animated animate__fadeOutLeft animate__faster">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
</script>
<style scoped>
</style>


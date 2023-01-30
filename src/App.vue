<template>
  <div class="font-open-sans">
    <router-view v-slot="{ Component, route }">
      <Transition mode="out-in"
        :enter-active-class="'animate__animated animate__faster ' + (route.meta.transition_in || ' animate__fadeIn')"
        :leave-active-class="'animate__animated animate__faster ' + (route.meta.transition_out || ' animate__fadeOut')">
        <component :is="Component"></component>
      </Transition>
    </router-view>
  </div>
</template>

<script setup>
</script>
<style scoped>

</style>


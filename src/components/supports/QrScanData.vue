<template>
  <a
    :href="props.value"
    v-if="isLink"
    class="
      flex
      mx-auto
      justify-center
      items-center
      cursor-pointer
      text-sky-500
      py-2
      truncate
      px-3
      rounded-md
    "
    target="_blank"
  >
    <i class="ri-link text-sky-400 px-2 no-underline"></i
    ><span class="underline">{{ props["value"] }}</span>
  </a>
  <a
    v-else-if="isPhone"
    :href="`tel:${props.value}`"
    class="
      flex
      w-fit
      mx-auto
      text-rose-600
      justify-center
      items-center
      cursor-pointer
      bg-rose-300
      py-2
      truncate
      px-3
      rounded-full
    "
  >
    <i class="ri-phone-line px-2"></i>
    <span>{{ props.value }}</span></a
  >
  <a
    v-else-if="isMail"
    :href="`mailto:${props.value}`"
    class="
      flex
      w-fit
      mx-auto
      justify-center
      items-center
      cursor-pointer
      text-sky-700
      py-2
      truncate
      px-3
      rounded-md
    "
  >
    <i class="ri-mail-send-line text-sky-400 px-2"></i>
    <span>{{ props.value }}</span></a
  >
  <p v-else class="text-gray-600 py-2 truncate px-3 rounded-md">
    {{ props.value || "Không có dữ liệu" }}
  </p>
</template>

<script setup>
import { computed, defineProps } from "vue";

const PHONE_REGEX = /^(\+?)[0-9]+$/;
const MAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const props = defineProps(["value"]);
const isLink = computed(() => {
  try {
    new URL(props.value);
    return true;
  } catch {
    return false;
  }
});

const isPhone = computed(() => {
  return PHONE_REGEX.test(props.value);
});

const isMail = computed(() => {
  return MAIL_REGEX.test(props.value);
});
</script>
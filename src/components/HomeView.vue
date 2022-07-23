<template>
  <div class="w-full h-screen flex flex-wrap justify-center items-center">
    <section id="buttons" class="w-3/4 sm:max-w-sm">
      <img id="code" src="@/assets/quochuy.png" class="w-28 mx-auto" />
      <p class="
          font-sans
          text-center text-sm
          font-semibold
          mt-2
          leading-6
          text-red-700
          mb-8
        ">
        Văn phòng <br />
        HĐND và UBND huyện Thủy Nguyên
      </p>
      <router-link to="/gen" class="
          mx-auto
          sm:w-3/4
          hover:bg-sky-200
          text-center
          py-4
          text-sky-600
          border-2 border-sky-500
          flex
          items-center
          justify-center
        ">
        <i class="ri-qr-code-line mr-1 text-sky-300"></i>Tạo mã QR
      </router-link>
      <router-link to="/scan" class="
          mx-auto
          sm:w-3/4
          mt-4
          text-center
          hover:bg-amber-100
          py-4
          text-amber-600
          border-2 border-amber-500
          flex
          items-center
          justify-center
        "><i class="ri-qr-scan-line mr-1 text-amber-300"></i>Quét mã
        QR</router-link>
    </section>
  </div>
</template>

<script setup>

</script>
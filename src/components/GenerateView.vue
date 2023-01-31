<template>
  <div class="w-full h-screen justify-center items-center flex flex-wrap">
    <div class="
        top-0
        w-full
        absolute
        py-3
        flex
        items-center
        bg-amber-500
        text-xs text-white
        pl-4
      ">
      <router-link to="/"><i class="ri-arrow-left-line text-lg mr-2"></i></router-link>
      Văn phòng HĐND và UBND huyện Thủy Nguyên
    </div>
    <section id="main" class="w-full text-center">
      <div id="code" class="w-3/4 sm:max-w-xs mx-auto flex justify-center"></div>
      <div class="w-1/2 mx-auto">
        <p class="
            mt-1
            max-w-full
            truncate
            text-center
            font-sans
            text-xs text-gray-500
            bg-slate-200
            py-1
            px-5
            inline-block
            rounded-full
          ">
          {{ qrData || "https://qlvb.hpnet.vn" }}
        </p>
      </div>

      <div id="input" class="
          w-full
          font-sans
          text-sm
          flex flex-wrap
          justify-center
          gap-y-3
          mt-10
        ">
        <input type="text" placeholder="Liên kết, số điện thoại, email ...v.v.."
          class="w-4/5 px-3 py-2 border-2 border-sky-300 sm:max-w-xs mb-5" name="" v-model="qrData" id="" />
      </div>
      <div id="actions" class="flex justify-center gap-x-2">
        <button @click="share" class="
            px-3
            text-sm
            rounded-md
            flex
            items-center
            font-open-sans
            text-sky-700
            bg-sky-200
          ">
          <i class="ri-share-line text-lg pr-2 text-blue-400"></i> Chia sẻ mã QR
        </button>
        <button @click="download" class="
            px-3
            text-sm
            rounded-md
            flex
            items-center
            font-open-sans
            text-amber-700
            bg-yellow-200
          ">
          <i class="ri-file-download-line text-lg pr-2 text-amber-400"></i>
          Tải về mã QR
        </button>
      </div>
    </section>
  </div>
</template>
<style>
div#code>canvas {
  width: 100%;
}
</style>
<script setup>
import QRCodeStyling from "qr-code-styling";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import qrOptions from "../qrOptions.json";
import quochuy from "../assets/quochuy.png";


const qrData = ref("https://qlvb.hpnet.vn");
const route = useRoute()

const qrCode = new QRCodeStyling({
  ...qrOptions,
  image: quochuy,
  data: qrData.value,
});

onUnmounted(() => {
  document.querySelectorAll("#code *").forEach((node) => {
    document.getElementById("code").removeChild(node);
  });
});

onMounted(() => {
  watch(qrData, () => {
    qrCode.update({
      data: qrData.value || "https://qlvb.hpnet.vn",
    });
  });
  if (route.query.data)
    qrData.value = route.query.data;
  setTimeout(() => {
    const oldCanvases = document.querySelectorAll("div#code canvas");
    oldCanvases.forEach(canvas => canvas.remove())
    qrCode.append(document.querySelector("#code"));
  }, 1500);

});

async function share() {
  if (navigator.share) {
    const imageFile = new File([await qrCode.getRawData()], "qrCode.png", {
      type: "image/png",
    });
    navigator
      .share({
        title: "Mã QR",
        text: "Nội dung",
        url: qrData.value,
        files: [imageFile],
      })
      .then(() => { })
      .catch(() => {
        console.error("Không thể chia sẻ");
      });
  }
}

async function download() {
  qrCode.download({
    name: "qrCode",
    extension: "png",
  });
}
</script>
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
        <a class="hidden" href="https://google.com" ref="download_link"></a>
      </div>
    </section>
  </div>
  <div v-if="show_loader" id="loader" class="w-full bg-opacity-70 h-screen bg-slate-700 fixed flex-wrap flex justify-center items-center z-10 top-0">
    <div class="text-center">
      <span class="loader"></span>
      <p class="text-white font-semibold mt-2">Đang tạo ảnh...</p>
    </div>
  </div>
</template>
<style>
.loader {
  width: 48px;
  height: 48px;
  border: 3px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-bottom-color: #FF3D00;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
<script setup>
import QRCodeStyling from "qr-code-styling";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import qrOptions from "../qrOptions.json";
import quochuy from "../assets/quochuy.png";
import html2canvas from "html2canvas";

const qrData = ref("https://qlvb.hpnet.vn");
const route = useRoute()
let width = 0;
let interval = 0;
const download_link = ref(null);
const show_loader = ref(false);


function generateQRCode() {
  return new QRCodeStyling({
    ...qrOptions,
    image: quochuy,
    data: qrData.value,
    type: "svg"
  });
}

const qrCode = generateQRCode();

function updateQrCode() {
  qrCode.update({
    data: qrData.value || "https://qlvb.hpnet.vn",
    width,
    type: "svg",
  })
}


function updateQrCodeWidth() {
  width = document.querySelector("div#code").offsetWidth;
}


onUnmounted(() => {
  document.querySelector('#code svg').remove();
  [updateQrCode, updateQrCodeWidth].forEach(cb => {
    window.removeEventListener("resize", cb, true);
  })
});

onMounted(() => {

  setTimeout(() => {
    window.addEventListener("resize", updateQrCodeWidth);
    watch(qrData, () => {
      updateQrCode();
    });
    if (route.query.data)
      qrData.value = route.query.data;
    updateQrCodeWidth();
    updateQrCode();
    qrCode.append(document.querySelector("#code"));
  }, 500);
});

async function share() {
  if (navigator.share) {
    show_loader.value = true;
    const canvas = await html2canvas(document.querySelector("div#code"));
    const promise = new Promise((y) => {
      canvas.toBlob(y);
    })
    const blob = await promise;
    const imageFile = new File([blob], "qrCode.png", {
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
      show_loader.value = false;
  }
}

async function download(e) {
  e.preventDefault();
  show_loader.value = true;
  const a = download_link.value;
  const canvas = await html2canvas(document.querySelector("div#code"));
  const dataURL = canvas.toDataURL();
  a.download = "qrCode.png";
  a.href = dataURL;
  a.click();
  show_loader.value = false;
}
</script>
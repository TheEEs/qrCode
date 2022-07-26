<template>
  <div class="w-full h-screen flex flex-wrap justify-center items-center">
    <div
      class="
        top-0
        w-full
        absolute
        py-3
        flex
        items-center
        bg-amber-500
        text-xs text-white
        pl-4
      "
    >
      <router-link to="/"
        ><i class="ri-arrow-left-line text-lg mr-2"></i
      ></router-link>
      Văn phòng HĐND và UBND huyện Thủy Nguyên
    </div>
    <section id="video" class="w-4/5 sm:max-w-lg">
      <p
        class="
          text-sm
          font-mono
          px-3
          mb-2
          py-1
          rounded-full
          bg-slate-300
          text-slate-700
          inline-block
        "
      >
        {{ status }}
      </p>
      <video
        id="webcam"
        class="border-2 w-full border-gray-600"
        v-show="cameraUsable"
      ></video>
      <img
        :src="backgroundImageURL"
        v-if="!cameraUsable"
        id="selectedCamera"
        class="w-full max-w-full min-h-full"
        alt=""
      />
      <div
        id="cameraSelection"
        class="flex items-baseline mt-3"
        v-if="cameraUsable"
      >
        <label class="text-xs text-gray-400" for="camera"
          >Lựa chọn camera</label
        >
        <select
          v-if="cameraUsable"
          v-model="selectedCamera"
          id="camera"
          name="camera"
          class="ml-3 grow bg-blue-200 rounded-sm inline"
        >
          <option
            class="text-sm font-open-sans bg-white"
            :value="c.id"
            v-for="c in cameraList"
            :key="c.id"
          >
            {{ c.label }}
          </option>
        </select>
      </div>
      <section id="scanValue" class="w-full text-center font-mono mt-8">
        <ScanValueLabel :value="scanValue"></ScanValueLabel>
      </section>
      <section id="scanValue" class="w-full text-center font-open-sans mt-4">
        <input
          v-show="false"
          accept="image/*"
          type="file"
          name="image"
          id="image"
          @change="changeImage"
        />
        <label
          for="image"
          class="
            mx-auto
            flex
            items-center
            justify-center
            gap-x-1
            bg-amber-400
            w-full
            sm:max-w-md
            text-white
            py-2
            truncate
            px-3
            rounded-md
          "
          ><i class="ri-image-add-line text-lg"></i>Quét từ hình ảnh</label
        >
      </section>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import QRScanner from "qr-scanner";
import QrScanner from "qr-scanner";
import ScanValueLabel from "@/components/supports/QrScanData.vue";

const cameraList = reactive([]);
const cameraUsable = ref(true);
const status = ref("Đang chờ camera ...");
const selectedCamera = ref("");
const scanValue = ref("");
const backgroundImageURL = ref("");

var qrScanner;

/*const background_url = computed(() => {
  return `url("${backgroundImageURL.value}")`;
});*/

async function detectQrFromImage(dataURL) {
  const options = {
    returnDetailedScanResult: true,
    alsoTryWithoutScanRegion: true,
  };
  try {
    const result = await QrScanner.scanImage(dataURL, {
      ...options,
    });
    scanValue.value = result.data;
  } catch (e) {
    console.error(e);
    scanValue.value = "Không thể phát hiện mã QR";
  }
}

function changeImage(e) {
  const tag = e.target;
  if (tag.files) {
    const file = tag.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      backgroundImageURL.value = e.target.result;
      detectQrFromImage(file);
    };
    fileReader.readAsDataURL(file);
  }
}

onMounted(async () => {
  const vid = document.getElementById("webcam");
  qrScanner = new QrScanner(
    vid,
    (result) => {
      scanValue.value = result.data;
    },
    {
      returnDetailedScanResult: true,
      preferredCamera: "environment",
      highlightScanRegion: true,
    }
  );
  if (await QRScanner.hasCamera()) {
    status.value = "Đang chờ camera ...";
    const cams = await QRScanner.listCameras(true);
    cams.forEach((c) => {
      cameraList.push(c);
    });
    qrScanner
      .start()
      .then(() => {
        cameraUsable.value = true;
        status.value = "Đặt mã QR trước camera";
        watch(selectedCamera, (newValue, oldValue) => {
          if (newValue !== oldValue) {
            qrScanner.setCamera(newValue);
          }
        });
      })
      .catch(() => scanFromFile());
  } else {
    scanFromFile();
  }
});

onUnmounted(() => {
  qrScanner.stop();
});

async function scanFromFile() {
  status.value = "Quét từ tệp tin";
  cameraUsable.value = false;
  await qrScanner.destroy();
  await qrScanner.stop();
}
</script>
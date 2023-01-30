<template>
    <div class="bg-slate-200">
        <div class="
        top-0
        w-full
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
        <div class="sm:max-w-sm sm:mx-auto h-screen bg-white">

            <div class="mx-4 pt-5">
                <em class="text-sm font-light text-gray-500">Tài liệu</em>
                <h3 class="font-semibold text-lg pl-2 border-l-2 border-l-sky-400">{{ document.title }}</h3>
            </div>

            <div class="mt-4 mx-4">
                <figure v-for="f in file_ids" :key="f" class="w-full">
                    <div class="w-full text-justify pt-3 flex items-center">
                        <a target="_blank" :href="getFileForView(f)"
                            class="text-sm text-sky-600 leading-tight hover:text-orange-400 cursor-pointer">{{
    files[f]? files[f].name : ""
                            }}</a>
                    </div>
                </figure>
            </div>
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases, storage } from '@/client';
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const document = ref({});
const file_ids = ref([]);

const files = ref({});

onMounted(async () => {
    try {
        const data = route.params.id;
        const docs = await databases.getDocument(process.env.VUE_APP_DB_ID,
            process.env.VUE_APP_COLLECTION_ID, data);
        document.value = docs;
        file_ids.value = docs.files;
        file_ids.value.forEach(async (f) => {
            files.value[f] = await storage.getFile(process.env.VUE_APP_BUCKET_ID, f);
        });
    }
    catch {
        return Swal.fire({
            title: ":(",
            text: "Không tìm thấy thư mục",
            icon: "error",
            confirmButtonText: "Trở về trang chủ"
        }).then(() => {
            router.push({ path: "/" });
        })
    }
})

function getFileForView(id) {
    return storage.getFileView(process.env.VUE_APP_BUCKET_ID, id);
}

</script>
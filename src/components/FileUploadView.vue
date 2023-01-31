<template>
    <div id="modal" class="w-full h-screen bg-slate-200 flex items-center justify-center">
        <div class="h-full w-full sm:max-w-sm bg-white">
            <div class="flex justify-between mx-4 my-4">
                <h1 class="font-sans text-xl font-semibold">Tải lên tài liệu</h1>
                <i class="ri-close-line text-xl" @click="closeModal"></i>
            </div>
            <div class="mx-4 mt-3">
                <input type="file" name="files" id="files" class="hidden" multiple @change="fileSelect">
                <label for="files"
                    class="px-3 py-2 w-full flex items-center justify-center text-center bg-teal-500 text-teal-50">
                    <i class="ri-file-add-line mx-1"></i> Thêm file
                </label>
            </div>
            <div class="px-4 my-1">
                <input type="text" v-model="folder_name" placeholder="Tên thư mục" name="" class="w-full px-1 py-1 mt-2 font-sans font-semibold text-slate-600" id="">
            </div>
            <div class="mt-4 mx-4 h-3/5 overflow-auto">
                <div v-for="f in files" :key="f">
                    <div class="pt-2 flex justify-between">
                        <h3 class=" font-mono text-sm whitespace-nowrap truncate w-3/4">{{ f.name }}</h3>
                        <i class="ri-delete-back-line hover:text-rose-300" @click="removeFile(f)"></i>
                    </div>
                    <ProgressBar :value="upload_progresses[f] || 0"></ProgressBar>
                </div>
            </div>
            <div class="mt-2 mx-4">
                <div @click="uploadFile"
                    class="py-2 w-full flex items-center justify-center text-md outline-1 outline-dashed border-amber-500 text-amber-500">
                    <i class="ri-file-upload-line px-1"></i>Tải lên
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { storage, databases } from "../client";
import { ID, Permission, Role } from 'appwrite';
import ProgressBar from "./supports/ProgressBar.vue";

const router = useRouter();
const files = ref([]);
const upload_progresses = ref({});
const file_status = ref({});
const folder_name = ref("");
let uploaded_files = [];

function closeModal() {
    router.push({ path: '/' });
}

function fileSelect(e) {
    const _f = e.target.files;
    files.value.push(..._f);
    files.value = [...new Set(files.value)];
}

function removeFile(f) {
    files.value = files.value.filter((_f) => f !== _f);
}

const TOAST_STYLES = {
    "success": "linear-gradient(to right, #2980b9, #8e44ad)",
    "info": "linear-gradient(to right, #1abc9c, #3498db)",
    "failure": "linear-gradient(to right, #f39c12, #c0392b)"
}

function showToast(msg, status) {
    Toastify({
        text: msg,
        duration: 2000,
        newWindow: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: TOAST_STYLES[status],
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

async function uploadFile() {
    if (!files.value.length) {
        showToast("Không có file!", "info");
        return;
    }
    files.value.forEach(f => {
        upload_progresses.value[f] = 0;
    });
    await Promise.all(files.value.map(async (f) => {
        return storage.createFile(process.env.VUE_APP_BUCKET_ID, ID.unique(), f,
            [Permission.write(Role.any()), Permission.read(Role.any())], function (p) {
                upload_progresses.value[f] = p.progress;
                console.log(`${p.progress}: ${f.name}`)
            }
        )
            .then((uploaded_file) => {
                console.log(uploaded_file);
                uploaded_files.push(uploaded_file.$id);
                upload_progresses.value[f] = 100;
                file_status[f] = 1;
            })
            .catch(() => { file_status[f] = 0; showToast(`Tải lên thất bại: ${f.name}`, "failure") })
    }))
    const doc = await databases.createDocument(
        process.env.VUE_APP_DB_ID,
        process.env.VUE_APP_COLLECTION_ID,
        ID.unique(),
        {
            title: folder_name.value || "Tài liệu mới",
            files: uploaded_files
        },
    )
    files.value = [];
    upload_progresses.value = {};
    file_status.value = {};
    uploaded_files = [];
    showToast("Tải tên hoàn tất!", "success");
    setTimeout(()=>{
        router.push({path: "/gen", query: {data: `${process.env.VUE_APP_REDIRECT_URL}/${doc.$id}`}})
    },2000);
}
</script>
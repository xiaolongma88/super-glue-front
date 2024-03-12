<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>图片上传</h5>
                <FileUpload name="image" url="http://127.0.0.1:5000/api/upload" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000"/>
            </div>
        </div>
        <Toast />
    </div>
</template>

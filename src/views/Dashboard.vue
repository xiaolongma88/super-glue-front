<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import CoreService from '@/service/coreService'
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { usePrimeVue } from "primevue/config";
import { useToast } from "primevue/usetoast";

const value = ref(50)
const results = ref(null)
const coreService = new CoreService();
const $primevue = usePrimeVue();
const toast = useToast();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const state = reactive({
  isDone:1
})
let componentKey= 0

onMounted(() => {

});



const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const uploadEvent = (callback) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const onTemplatedUpload = () => {
  toast.add({ severity: "info", summary: "Success", detail: "文件上传成功", life: 3000 });
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};
const run = ()=>{
  state.isDone = 2
  for (const file of files.value) {
    coreService.runSuperglue(file.name).then((data)=>{
      coreService.superGlueRes().then((data) => {
        results.value = data;
        state.isDone = 3
        toast.add({ severity: "info", summary: "Success", detail: "匹配成功", life: 3000 });
      });
      componentKey +=1


    })

  }
}
</script>

<template>
  <Splitter style="height: 600px" class="mb-5">
    <SplitterPanel class="align-items-center justify-content-center"  v-if="true">
        <Toast />
        <FileUpload name="image" url="http://127.0.0.1:5000/api/match_img" @upload="onTemplatedUpload($event)" :multiple="false" accept="image/*" :maxFileSize="1000000" @select="onSelectedFiles">
          <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
            <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
              <div class="flex gap-2">
                <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined></Button>
                <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                <Button label="开始匹配 " @click="run" raised />
              </div>
              <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
              ><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar
              >
            </div>
          </template>
          <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
            <div v-if="files.length > 0">
              <h5>待上传</h5>
              <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                  <div>
                    <img role="presentation" :alt="file.name" :src="file.objectURL" width="256" height="256" />
                  </div>
<!--                  <span class="font-semibold">{{ file.name }}</span>-->
                  <div>{{ formatSize(file.size) }}</div>
                  <Badge value="Pending" severity="warning" />
                  <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded  severity="danger" />
                </div>
              </div>
            </div>

            <div v-if="uploadedFiles.length > 0">
              <h5>已上传</h5>
              <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                  <div>
                    <img role="presentation" :alt="file.name" :src="file.objectURL" width="256" height="256" />
                  </div>
                  <div>{{ formatSize(file.size) }}</div>
                  <Badge value="Completed" class="mt-3" severity="success" />
                  <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded  severity="danger" />
                </div>
              </div>
            </div>
          </template>
          <template #empty>
            <div class="flex align-items-center justify-content-center flex-column">
              <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
              <p class="mt-4 mb-0">拖拽文件上传</p>
            </div>
          </template>
        </FileUpload>
    </SplitterPanel>
    <SplitterPanel class="flex flex-column align-items-center justify-content-center imgs" :size="75" :key="componentKey">
      <div v-if="state.isDone===1">请上传匹配图片</div>
      <ProgressSpinner v-else-if="state.isDone===2"/>
      <ScrollPanel v-if="state.isDone===3" style="width: 100%; height: 500px">
        <div style="margin-left:50px">
          <img alt="user header" v-for="(item) of results" :src="item.image" class="imgs"/>
        </div>

      </ScrollPanel>

    </SplitterPanel>
  </Splitter>
</template>
<style scoped lang="css" >
.imgs {
  margin:10px
}
</style>

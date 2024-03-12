<script setup>
import { ref, onMounted } from 'vue';
import ProductService from '@/service/ProductService';
import CoreService from '@/service/coreService'
import { useToast } from "primevue/usetoast";

const coreService = new CoreService();
const results = ref(null)
let componentKey= 0
const toast = useToast();
const dataviewValue = ref(null);
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'Date High to Low', value: '!price' },
    { label: 'Date Low to High', value: 'price' }
]);

const productService = new ProductService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (dataviewValue.value = data));
    setTimeout(()=>{
      console.log(dataviewValue.value);
    },100)

});
const delAll = ()=>{
  coreService.delAllImg().then((data)=>{

    toast.add({ severity: "info", summary: "Success", detail: "删除成功", life: 3000 });
  })
  componentKey +=1
}
const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>图库</h5>
                <DataView :value="dataviewValue" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField" :key="componentKey">
                    <template #header>
                        <div class="grid grid-nogutter">
                            <div class="col-6 text-left">
                              <Button icon="pi pi-trash" label="全部删除" @click="delAll" raised />
                            </div>
                            <div class="col-6 text-right">
                                <DataViewLayoutOptions v-model="layout" />
                            </div>
                        </div>
                    </template>

                    <template #list="slotProps">
                        <div class="col-12">
                            <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                                <img :src="slotProps.data.image" :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                                <div class="flex-1 text-center md:text-left">
                                    <div class="mb-3">{{ slotProps.data.description }}</div>
                                </div>
                                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                                    <Button icon="pi pi-trash" label="删除" :disabled="false" class="mb-2"></Button>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #grid="slotProps">
                        <div class="col-12 md:col-4">
                            <div class="card m-3 border-1 surface-border">
                                <div class="text-center img">
                                    <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-9 shadow-2 my-3 mx-0 img" />
                                    <div class="mb-3">{{ slotProps.data.description }}</div>
                                </div>
                                <div class="flex align-items-center justify-content-between">
                                    <Button icon="pi pi-trash" :disabled="false"></Button>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </div>



    </div>
</template>
<style lang="css" scoped>
.img {
  width:100%;
  margin:0;
}
</style>
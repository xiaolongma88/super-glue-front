<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

const model = ref([
  {
    label: "Home",
    items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }]
  },
  {
    label: "UI Components",
    items: [
      { label: "images", icon: "pi pi-fw pi-images", to: "/uikit/list" },
      { label: "uploadFile", icon: "pi pi-fw pi-file", to: "/uikit/file" },
      { label: "PrimeIcons", icon: "pi pi-fw pi-prime", to: "/utilities/icons" }
    ]
  },

  {
    label: "Pages",
    icon: "pi pi-fw pi-briefcase",
    to: "/pages",
    items: [
      {
        label: "Auth",
        icon: "pi pi-fw pi-user",
        items: [
          {
            label: "Login",
            icon: "pi pi-fw pi-sign-in",
            to: "/auth/login"
          },
          {
            label: "Error",
            icon: "pi pi-fw pi-times-circle",
            to: "/auth/error"
          },
          {
            label: "Access Denied",
            icon: "pi pi-fw pi-lock",
            to: "/auth/access"
          }
        ]
      },
      {
        label: "Crud",
        icon: "pi pi-fw pi-pencil",
        to: "/pages/crud"
      },
    ]
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>

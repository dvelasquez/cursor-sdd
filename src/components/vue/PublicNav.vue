<script setup lang="ts">
import Menubar from 'primevue/menubar';
import type { MenuItem } from 'primevue/menuitem';

// Navigation items (home, about, login) per spec clarification
const items: MenuItem[] = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      window.location.href = '/';
    }
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    command: () => {
      window.location.href = '/about';
    }
  },
  {
    label: 'Login',
    icon: 'pi pi-sign-in',
    command: () => {
      window.location.href = '/login';
    }
  }
];
</script>

<template>
  <div class="w-full bg-gray-800 border-b border-gray-700">
    <Menubar 
      :model="items" 
      class="bg-transparent border-none rounded-none w-full px-4 py-3"
    />
  </div>
</template>

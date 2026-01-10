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
  <nav class="w-full bg-gray-800 border-b border-gray-700">
    <Menubar 
      :model="items" 
      class="bg-transparent border-none rounded-none w-full px-4 py-3 nav-menubar-custom"
    >
      <template #item="{ item, props: itemProps }">
        <a
          v-bind="itemProps.action"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer font-medium no-underline"
          :class="{ 'bg-gray-700 text-white': itemProps.active }"
          @click="item.command && item.command()"
        >
          <i v-if="item.icon" :class="item.icon" class="text-sm" />
          <span>{{ item.label }}</span>
        </a>
      </template>
    </Menubar>
  </nav>
</template>

<style scoped>
/* Style menu list container */
:deep(.nav-menubar-custom .p-menubar-list) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Style mobile menu button - hide on desktop */
@media (min-width: 768px) {
  :deep(.nav-menubar-custom .p-menubar-button) {
    display: none;
  }
}

/* Style mobile menu button on mobile */
:deep(.nav-menubar-custom .p-menubar-button) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  color: rgb(209 213 219);
  background: transparent;
  border: none;
  transition: background-color 0.2s, color 0.2s;
}

:deep(.nav-menubar-custom .p-menubar-button:hover) {
  background-color: rgb(55 65 81);
  color: white;
}
</style>

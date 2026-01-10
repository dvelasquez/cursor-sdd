<script setup lang="ts">
import { ref } from 'vue';

// Navigation items (dashboard, profile, logout) per spec clarification
interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'pi pi-th-large' },
  { label: 'Profile', href: '/profile', icon: 'pi pi-user' },
  { label: 'Logout', href: '#', icon: 'pi pi-sign-out' }, // Logout handled by event, not navigation
];

const isMobileMenuOpen = ref(false);

function navigate(href: string) {
  if (href === '#') {
    // Logout handled by event, not navigation
    // TODO: Emit logout event (T062-T064)
    return;
  }
  window.location.href = href;
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}
</script>

<template>
  <nav class="bg-transparent border-none w-full">
    <div class="flex items-center">
      <!-- Desktop: Horizontal menu items -->
      <ul class="hidden md:flex items-center gap-1 list-none m-0 p-0">
        <li v-for="item in navItems" :key="item.href" class="relative">
          <a
            :href="item.href"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer font-medium no-underline"
            @click.prevent="navigate(item.href)"
          >
            <i :class="item.icon" class="text-sm" />
            <span>{{ item.label }}</span>
          </a>
        </li>
      </ul>

      <!-- Mobile: Hamburger button (will show overlay menu on click) -->
      <button
        type="button"
        class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border-none bg-transparent"
        aria-label="Toggle navigation menu"
        @click="toggleMobileMenu"
      >
        <i class="pi pi-bars text-lg" />
      </button>
    </div>

    <!-- Mobile: Overlay menu -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden bg-gray-800 border-t border-gray-700 mt-2"
    >
      <ul class="flex flex-col list-none m-0 p-0">
        <li v-for="item in navItems" :key="item.href">
          <a
            :href="item.href"
            class="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer font-medium no-underline border-b border-gray-700 last:border-b-0"
            @click.prevent="navigate(item.href); isMobileMenuOpen = false"
          >
            <i :class="item.icon" class="text-sm" />
            <span>{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

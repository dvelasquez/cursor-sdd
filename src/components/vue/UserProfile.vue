<script setup lang="ts">
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import type { MockUserSession } from '../../lib/fixtures/mock-user-session';

interface UserProfileProps {
  userSession: MockUserSession;
}

const props = defineProps<UserProfileProps>();

// Define emits for logout event
const emit = defineEmits<{
  logout: [];
}>();

// Display avatar image if available, otherwise use initial from label prop
const avatarImage = props.userSession.avatar;
const avatarLabel = props.userSession.initial || '?';
const displayName = props.userSession.username || props.userSession.email || 'User';

// Handle logout button click - emit logout event and redirect to homepage (mock behavior per T063)
function handleLogout() {
  emit('logout');
  // Mock behavior: redirect to homepage (per T063)
  // In a real app, the layout would handle the logout event and perform session cleanup
  window.location.href = '/';
}
</script>

<template>
  <div class="flex items-center gap-3 ml-auto">
    <!-- Avatar: use image if available, otherwise use label (initial) -->
    <Avatar
      v-if="avatarImage"
      :image="avatarImage"
      :label="avatarLabel"
      shape="circle"
      size="normal"
      class="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center flex-shrink-0"
    />
    <Avatar
      v-else
      :label="avatarLabel"
      shape="circle"
      size="normal"
      class="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold flex-shrink-0"
    />
    
    <!-- Username/Email display -->
    <div class="flex flex-col min-w-0">
      <span class="text-white text-sm font-medium truncate">{{ displayName }}</span>
    </div>
    
    <!-- Logout button - emits logout event on click (per T062) -->
    <Button
      label="Logout"
      class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
      @click="handleLogout"
    />
  </div>
</template>

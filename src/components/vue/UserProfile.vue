<script setup lang="ts">
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import type { MockUserSession } from '../../lib/fixtures/mock-user-session';

interface UserProfileProps {
  userSession: MockUserSession;
}

const props = defineProps<UserProfileProps>();

// Display avatar image if available, otherwise use initial from label prop
const avatarImage = props.userSession.avatar;
const avatarLabel = props.userSession.initial || '?';
const displayName = props.userSession.username || props.userSession.email || 'User';
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Avatar: use image if available, otherwise use label (initial) -->
    <Avatar
      v-if="avatarImage"
      :image="avatarImage"
      :label="avatarLabel"
      shape="circle"
      size="normal"
      class="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center"
    />
    <Avatar
      v-else
      :label="avatarLabel"
      shape="circle"
      size="normal"
      class="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold"
    />
    
    <!-- Username/Email display -->
    <div class="flex flex-col">
      <span class="text-white text-sm font-medium">{{ displayName }}</span>
    </div>
    
    <!-- Logout button (no functionality yet per T051) -->
    <Button
      label="Logout"
      class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    />
  </div>
</template>

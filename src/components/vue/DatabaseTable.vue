<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import type { DatabaseTableProps } from '../../../specs/005-astro-db-turso/contracts/types';

// Explicitly register components to ensure they're available
// This helps with Vite's dependency resolution

const props = defineProps<DatabaseTableProps>();

// Format date for display
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};
</script>

<template>
  <div class="database-table-container">
    <!-- Loading State -->
    <div v-if="props.loading" class="flex justify-center items-center p-8">
      <ProgressSpinner />
      <span class="ml-4">Loading database data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="props.error" class="p-4">
      <Message severity="error" :closable="false">
        <span>{{ props.error }}</span>
      </Message>
    </div>

    <!-- Empty State -->
    <div v-else-if="props.data.length === 0" class="p-4">
      <Message severity="info" :closable="false">
        <span>The table is empty.</span>
      </Message>
    </div>

    <!-- Success State: Display Table -->
    <DataTable v-else :value="props.data" :paginator="false" :rows="100" class="p-datatable-sm">
      <Column field="id" header="ID" :sortable="true" />
      <Column field="name" header="Name" :sortable="true" />
      <Column field="created_at" header="Created At" :sortable="true">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.database-table-container {
  width: 100%;
}
</style>

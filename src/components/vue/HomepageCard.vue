<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Chip from 'primevue/chip';
import Tag from 'primevue/tag';

// Handle button click - show alert (mock behavior per T082)
function handleButtonClick() {
	alert('Button clicked! This demonstrates interactive PrimeVue components.');
}
</script>

<template>
	<div class="w-full max-w-2xl mx-auto">
		<Card
			:pt="{
				root: 'bg-gray-800 rounded-lg border-2 border-gray-500 shadow-lg',
				body: 'p-4 md:p-6',
				title: 'mb-4',
				content: 'mb-4',
			}"
		>
			<template #title>
				<div class="flex items-center gap-3">
					<h2 class="text-2xl font-semibold text-white m-0">Welcome</h2>
					<Badge
						value="New"
						:pt="{
							root: 'bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full',
						}"
					/>
				</div>
			</template>
			<template #content>
				<p class="text-gray-300 m-0 mb-4">
					This is the homepage enhanced with PrimeVue components. The Card component demonstrates modern UI patterns while maintaining consistency with our standard public layout.
				</p>

				<div class="flex flex-wrap items-center gap-3 mb-4">
					<Tag
						value="Featured"
						severity="info"
						:pt="{
							root: 'bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full',
						}"
					/>
					<Chip
						label="Vue 3"
						:pt="{
							root: 'bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full',
						}"
					/>
					<Chip
						label="PrimeVue"
						:pt="{
							root: 'bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full',
						}"
					/>
					<Chip
						label="Astro"
						:pt="{
							root: 'bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full',
						}"
					/>
				</div>

				<Button
					label="Get Started"
					class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
					@click="handleButtonClick"
				/>
			</template>
		</Card>
	</div>
</template>
<script setup lang="ts">
import Button from 'primevue/button';
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <h2 class="text-2xl font-bold mb-4">Testing Tailwind Utilities with PrimeVue (Unstyled Mode - Full Tailwind Control)</h2>
    
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">Plain HTML Buttons (to verify Tailwind works):</h3>
      <button class="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-4 py-2">Plain Button (Blue)</button>
      <button class="bg-green-500 hover:bg-green-700 text-white rounded-lg px-4 py-2">Plain Button (Green)</button>
      <button class="bg-red-500 hover:bg-red-700 text-white rounded-lg px-4 py-2">Plain Button (Red)</button>
      <button class="bg-purple-500 hover:bg-purple-700 text-white rounded-lg px-4 py-2">Plain Button (Purple)</button>
      <button class="bg-orange-500 hover:bg-orange-700 text-white rounded-lg px-4 py-2">Plain Button (Orange)</button>
    </div>

    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">PrimeVue Buttons (unstyled mode - full Tailwind control):</h3>
      <Button label="PrimeVue (Default - Unstyled)" class="bg-gray-500 hover:bg-gray-700 text-white rounded-lg px-4 py-2" />
      <Button label="PrimeVue + Tailwind Blue" class="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-4 py-2" />
      <Button label="PrimeVue + Tailwind Green" class="bg-green-500 hover:bg-green-700 text-white rounded-lg px-4 py-2" />
      <Button label="PrimeVue + Tailwind Red" class="bg-red-500 hover:bg-red-700 text-white rounded-lg px-4 py-2" />
      <Button label="PrimeVue + Tailwind Purple" class="bg-purple-500 hover:bg-purple-700 text-white rounded-lg px-4 py-2" />
      <Button label="PrimeVue + Tailwind Orange" class="bg-orange-500 hover:bg-orange-700 text-white rounded-lg px-4 py-2" />
    </div>

    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">Styled Divs (to verify Tailwind works):</h3>
      <div class="bg-blue-600 text-white rounded-lg p-4">
        Test div (Blue): bg-blue-600, text-white, rounded-lg
      </div>
      <div class="bg-purple-600 text-white rounded-lg p-4">
        Test div (Purple): bg-purple-600, text-white, rounded-lg
      </div>
      <div class="bg-red-600 text-white rounded-lg p-4">
        Test div (Red): bg-red-600, text-white, rounded-lg
      </div>
      <div class="bg-green-600 text-white rounded-lg p-4">
        Test div (Green): bg-green-600, text-white, rounded-lg
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">Font Test (Instrument Sans):</h3>
      <p class="text-base">This text should use Instrument Sans font (PrimeVue Aura theme default).</p>
      <p class="text-base font-medium">Medium weight: Instrument Sans</p>
      <p class="text-base font-semibold">Semibold weight: Instrument Sans</p>
      <p class="text-base font-bold">Bold weight: Instrument Sans</p>
    </div>
  </div>
</template>

<template>
  <div
    id="PostOptionOverlay"
    class="absolute flex items-center z-50 top-0 left-0 w-full h-screen bg-black/60 p-3"
  >
    <div class="max-w-sm w-full mx-auto mt-10 bg-white rounded-xl text-center">
      <button
        @click="emits('deleteSelected', { deleteType, id })"
        class="font-bold w-full text-red-600 p-3 text-lg border-b border-b-gray-300 cursor-pointer"
      >
        Delete {{ deleteType }}
      </button>
      <div class="p-3 text-lg cursor-pointer" @click="emits('close')">
        Cancel
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(["close", "deleteSelected"]);
const props = defineProps(["deleteType", "id"]);

const { id, deleteType } = toRefs(props);
</script>

<style></style>

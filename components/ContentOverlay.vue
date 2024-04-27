<template>
  <div
    v-if="postByUser?.length > 0"
    class="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 grid-cols-3 gap-3 h-full overflow-y-auto"
  >
    <div
      v-for="post in postByUser"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
      class="flex items-center justify-center cursor-pointer relative"
    >
      <div
        @click="
          $generalStore.selectedPost = post;
          emits('openPost');
        "
        v-if="isHover"
        :class="isHover ? 'bg-black/40' : ''"
        class="absolute w-full h-full flex items-center justify-around text-lg font-bold text-white"
      >
        <div class="flex items-center justify-around w-1/2">
          <div class="flex items-center justify-center">
            <Icon name="mdi:heart" color="white" size="30" />
            <div class="pl-1">{{ post.likes.length }}</div>
          </div>
          <div class="flex items-center justify-center">
            <Icon name="mdi:comment" color="white" size="30" />
            <div class="pl-1">{{ post.comments.length }}</div>
          </div>
        </div>
      </div>
      <NuxtImg
        loading="lazy"
        class="aspect-square mx-auto object-cover cursor-pointer"
        :src="post.file"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $generalStore } = useNuxtApp();

const props = defineProps(["postByUser"]);
const emits = defineEmits(["openPost"]);
const { postByUser } = toRefs(props);

let isHover = ref();
</script>

<style></style>

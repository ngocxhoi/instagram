<template>
  <div
    class="w-full xl:inline-block xl:hover:bg-gray-100 p-2 rounded-full transition duration-300 ease-in-out cursor-pointer"
  >
    <div class="flex items-center">
      <NuxtImg
        v-if="iconString == 'Profile'"
        :class="{ 'mr-1': iconString == 'Profile' }"
        class="rounded-full ml-[2px] w-[30px] cursor-pointer"
        :src="$userStore.id ? $userStore.file : '/user-placeholder.png'"
      />
      <Icon v-else :name="icon" size="30" color="#004" />
      <span
        class="xl:block hidden text-black/80 font-bold text-[18px] pl-2 mt-0.5"
      >
        {{ iconString }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["iconString"]);
const { $userStore } = useNuxtApp();

const { iconString } = toRefs(props);

let icon = ref();

if (iconString?.value == "Home") icon.value = "mdi:home-outline";
if (iconString?.value == "Search") icon.value = "mdi:magnify";
if (iconString?.value == "Explore") icon.value = "mdi:compass";
if (iconString?.value == "Messages") icon.value = "mdi:send-outline";
if (iconString?.value == "Notifications") icon.value = "mdi:heart-outline";
if (iconString?.value == "Create") icon.value = "mdi:plus";
if (iconString?.value == "Profile") icon.value = "mdi:account-outline";
if (iconString?.value == "Log out") icon.value = "mdi:menu";
</script>

<style></style>

<template>
  <NuxtLayout>
    <LazyNuxtPage />
  </NuxtLayout>

  <GeneralOverlay v-if="isLoginOpen" />
</template>

<script setup lang="ts">
const { $generalStore, $userStore } = useNuxtApp();
const { isLoginOpen } = storeToRefs($generalStore);

onMounted(async () => {
  $generalStore.bodySwitch(false);
  isLoginOpen.value = true;

  try {
    await $userStore.getTokens();
    // await $generalStore.getRandomUsers();
    if ($userStore.id) {
      await $userStore.getUser();
    }
  } catch (error) {
    console.log(error);
  }

  setTimeout(() => {
    isLoginOpen.value = false;
  }, 500);
});

watch(
  () => isLoginOpen.value,
  (val) => $generalStore.bodySwitch(val)
);
</script>

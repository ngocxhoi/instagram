<template>
  <MainLayout>
    <div class="mx-auto lg:pl-0 md:pl-[80px] pl-0">
      <Carousel
        v-model="currentSlide"
        class="max-w-[700px] mx-auto"
        :breakpoints="breakpoints"
        :itemToScroll="4"
        :wrapAround="true"
        :transition="500"
        snapAlign="start"
      >
        <Slide v-for="slide in allUsers" :key="slide">
          <NuxtLink
            :to="`/profiles/${slide?.id}`"
            class="relative mx-auto text-center mt-4 px-2 cursor-pointer"
          >
            <div
              class="absolute -z-[1] -top-[5px] left-[4px] rounded-full min-w-[64px] h-[64px] contrast-[1.3] bg-gradient-to-tr from-yellow-300 to-purple-500 via-red-500"
            >
              <div
                class="rounded-full ml-[3px] mt-[3px] h-[58px] w-[58px] bg-white"
              />
            </div>
            <NuxtImg
              class="rounded-full w-[56px] h-[56px] -mt-[1px]"
              :src="slide?.file"
            />
            <div
              class="text-xs mt-2 w-[60px] truncate text-ellipsis overflow-hidden"
            >
              {{ slide?.name }}
            </div>
          </NuxtLink>
        </Slide>

        <template #addons>
          <Navigation />
        </template>
      </Carousel>

      <div
        v-for="post in posts"
        :key="post"
        :id="`Posts${post?.id}`"
        class="px-4 max-w-[600px] mx-auto mt-10"
      >
        <div class="flex items-center justify-between py-2">
          <div class="flex items-center">
            <NuxtLink
              :to="`/profile/${post?.user?.id}`"
              class="flex items-center"
            >
              <UAvatar :src="post?.user?.file" alt="Avatar" size="md" />
              <div class="ml-4 text-black font-bold text-lg">
                {{ post?.user?.name }}
              </div>
            </NuxtLink>
            <div class="flex text-gray-800 items-center">
              <div class="-mt-5 ml-2 mr-[5px] text-[35px]">.</div>
              <div class="text-xs">{{ post?.created_at }}</div>
            </div>
          </div>

          <Icon name="mdi:dots-horizontal" size="27" />
        </div>

        <div class="bg-black rounded-lg w-full min-h-[400px] flex items-center">
          <NuxtImg loading="lazy" class="mx-auto w-full" :src="post?.file" />
        </div>

        <LikeSection :post="post" />

        <div class="text-black font-bold py-1">
          {{ post.likes?.length }} likes
        </div>
        <div>
          <span class="text-black font-bold">{{ post.user.name }}</span>
          {{ post.text }}
        </div>
        <button
          @click="
            openOverlay = true;
            $generalStore.selectedPost = post;
          "
          class="text-gray-500 font-bold py-1"
        >
          View all {{ post.comments?.length }} comments
        </button>
      </div>
      <div class="pb-20"></div>
    </div>
  </MainLayout>

  <ShowPostOverlay
    v-if="openOverlay"
    :post="$generalStore.selectedPost"
    @addComment="addComment"
    @deleteSelected="deleteFun"
    @closeOverlay="openOverlay = false"
  />
</template>

<script setup>
useHead({
  title: "Home page",
});

import MainLayout from "~/layouts/MainLayout.vue";
const { $userStore, $generalStore } = useNuxtApp();

let currentSlide = ref(0);
let openOverlay = ref(false);

const breakpoints = {
  0: {
    itemsToShow: 6,
  },
  576: {
    itemsToShow: 8,
  },
};

const props = defineProps(["posts", "allUsers"]);
const { posts, allUsers } = storeToRefs($generalStore);

const addComment = async (obj) => {
  try {
    await $userStore.addComment({
      post_id: obj.post_id,
      user_id: obj.user_id,
      text: obj.text,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteFun = async (obj) => {
  openOverlay.value = false;

  try {
    if (obj.deleteType == "Post") {
      await $userStore.deletePost(obj.id);
    } else {
      await $userStore.deleteComment(obj.post.id, obj.id);
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  try {
    Promise.all([
      await $userStore.getTokens(),
      await $generalStore.getAllUsersAndPosts(),
      await $generalStore.getRandomUsers(),
    ]);
  } catch (error) {
    console.log(error);
  }
});
watch(
  () => openOverlay.value,
  (val) => $generalStore.bodySwitch(val)
);
</script>

<style>
.carousel_prev,
.carousel_next,
.carousel_prev:hover,
.carousel_next:hover {
  color: rgb(49, 49, 49);
  background-color: rgb(255, 255, 255);
  margin: 0 20px;
  padding: 10px;
}
</style>

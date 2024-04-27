<template>
  <MainLayout>
    <div>
      <div class="pt-2 md:pt-6"></div>
      <div class="max-w-[800px] lg:ml-0 md:ml-20 md:pl-20 px-4 w-screen">
        <div class="flex items-center md:justify-between">
          <label for="fileUser">
            <div
              class="md:w-[200px] md:h-[200px] h-[100px] w-[100px] overflow-hidden rounded-full flex items-center justify-center"
            >
              <img
                :src="$profileStore.file"
                class="w-full object-fill cursor-pointer"
              />
            </div>
          </label>

          <input
            v-if="$userStore.id == route.params.id"
            type="file"
            id="fileUser"
            hidden
            @input="getUpLoadedImage"
          />

          <div class="ml-6 w-full">
            <div class="flex items-center md:mb-8 mb-5">
              <div class="md:mr-6 mr-3 rounded-lg text-[22px]">
                {{ $profileStore.name }}
              </div>
              <div
                v-if="$userStore.id == route.params.id"
                class="md:block hidden md:mr-6 p-1 px-4 rounded-lg text-[16px] font-bold bg-gray-100 hover:bg-gray-200"
              >
                Edit Profile
              </div>
              <Icon name="mdi:cog" size="28" class="cursor-pointer" />
            </div>

            <button
              v-if="$userStore.id == route.params.id"
              class="md:hidden mr-6 p-1 px-4 max-w-[260px] w-full rounded-lg text-[17px] font-bold bg-gray-100 hover:bg-gray-200"
            >
              Edit Profile
            </button>

            <div class="md:block hidden">
              <div class="flex items-center text-[18px]">
                <div class="mr-6">
                  <span class="font-bold">{{
                    $profileStore.posts.length
                  }}</span>
                  Posts
                </div>
                <div class="mr-6">
                  <span class="font-bold">0</span> Follower
                </div>
                <div class="mr-6">
                  <span class="font-bold">0</span> Following
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="md:hidden">
          <div
            class="w-full flex items-center justify-around border-t border-t-gray-300 mt-8"
          >
            <div class="text-center p-3">
              <div class="font-bold">{{ $profileStore.posts.length }}</div>
              <div class="text-gray-400 font-bold -mt-1 5">Posts</div>
            </div>
            <div class="text-center p-3">
              <div class="font-bold">0</div>
              <div class="text-gray-400 font-bold">Follower</div>
            </div>
            <div class="text-center p-3">
              <div class="font-bold">0</div>
              <div class="text-gray-400 font-bold">Following</div>
            </div>
          </div>

          <div
            class="w-full flex items-center justify-between border-t border-t-gray-300"
          >
            <div
              class="p-3 w-1/4 flex justify-center border-t border-t-gray-900"
            >
              <Icon
                name="mdi:grid"
                size="28"
                color="#8e8e8e"
                class="cursor-pointer"
              />
            </div>
            <div class="p-3 w-1/4 flex justify-center">
              <Icon
                name="mdi:play-box-outline"
                size="28"
                color="#8e8e8e"
                class="cursor-pointer"
              />
            </div>
            <div class="p-3 w-1/4 flex justify-center">
              <Icon
                name="mdi:bookmark-outline"
                size="28"
                color="#8e8e8e"
                class="cursor-pointer"
              />
            </div>
            <div class="p-3 w-1/4 flex justify-center">
              <Icon
                name="mdi:account-box-outline"
                size="28"
                color="#8e8e8e"
                class="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div id="ContentSection" class="md:pr-1.5 lg:lg-0 md:pl-[90px]">
        <div class="md:block hidden mt-10 border-t border-t-gray-300">
          <div
            class="flex items-center justify-between max-w-[600px] mx-auto font-bold text-gray-400 text-[15px]"
          >
            <div
              class="p-[17px] w-1/4 flex justify-center items-center border-t border-t-gray-900"
            >
              <Icon
                name="mdi:grid"
                size="15"
                color="#000"
                class="cursor-pointer"
              />
              <span class="ml-2 -mb-[1px] text-gray-900">POSTS</span>
            </div>
            <div class="p-[17px] w-1/4 flex justify-center items-center">
              <Icon
                name="mdi:play-box-outline"
                size="15"
                color="#000"
                class="cursor-pointer"
              />
              <span class="ml-2 -mb-[1px] text-gray-900">REELS</span>
            </div>
            <div class="p-[17px] w-1/4 flex justify-center items-center">
              <Icon
                name="mdi:bookmark-outline"
                size="15"
                color="#000"
                class="cursor-pointer"
              />
              <span class="ml-2 -mb-[1px] text-gray-900">SAVES</span>
            </div>
            <div class="p-[17px] w-1/4 flex justify-center items-center">
              <Icon
                name="mdi:account-box-outline"
                size="15"
                color="#000"
                class="cursor-pointer"
              />
              <span class="ml-2 -mb-[1px] text-gray-900">TAGGED</span>
            </div>
          </div>
        </div>

        <ContentOverlay :postByUser="posts" @openPost="openPost = true" />

        <div class="pb-20"></div>
      </div>
    </div>
  </MainLayout>

  <ShowPostOverlay
    v-if="openPost"
    :post="$generalStore.selectedPost"
    @addComment="addComment"
    @deleteSelected="deleteFun"
    @closeOverlay="openPost = false"
  />
</template>

<script setup lang="ts">
import MainLayout from "~/layouts/MainLayout.vue";
const { $userStore, $generalStore, $profileStore } = useNuxtApp();
const route = useRoute();
const { posts } = storeToRefs($profileStore);

let openPost = ref(false);

onMounted(async () => {
  try {
    $profileStore.resetUser();
    Promise.all([
      await $userStore.getTokens(),
      await $profileStore.getProfile(`${route.params.user_id}`),
    ]);
  } catch (error) {
    console.log(error);
  }
});

const addComment = async (obj: any) => {
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

const deleteFun = async (obj: any) => {
  openPost.value = false;

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

const getUpLoadedImage = async (e: any) => {
  let file = e.target.files[0];
  let formData = new FormData();
  formData.append("file", file);

  try {
    await $userStore.updateUserImage(formData);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style></style>

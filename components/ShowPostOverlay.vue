<template>
  <div
    id="ShowPostOverlay"
    class="fixed z-40 top-0 left-0 w-full h-screen bg-black/60 p-3"
  >
    <button class="absolute right-3" @click="emits('closeOverlay')">
      <Icon name="mdi:close" size="27" color="white" />
    </button>

    <div
      class="max-w-6xl h-[calc(100%-100px)] mx-auto mt-10 bg-white rounded-xl"
    >
      <div class="w-full md:flex h-full overflow-auto rounded-xl">
        <div class="flex items-center bg-black w-full">
          <NuxtImg
            loading="lazy"
            class="rounded-xl min-w-[400px] p-4 mx-auto"
            :src="post?.file"
          />
        </div>

        <div class="md:max-w-[500px] w-full relative">
          <div class="flex items-center justify-between p-3 border-b">
            <div class="flex items-center">
              <UAvatar :src="post.user?.file" alt="Avatar" size="md" />
              <div class="ml-4 font-bold text-[15px]">
                {{ post.user?.name }}
              </div>
              <div class="flex items-center text-[15px] text-gray-500">
                <span class="-mt-5 ml-2 mr-[5px] text-[35px]">.</span>
                <div>{{ post.created_at }}</div>
              </div>
            </div>

            <button
              v-if="$userStore.id === post.user.id"
              @click="
                deleteType = 'Post';
                id = post.id;
              "
            >
              <Icon
                name="mdi:dots-horizontal"
                class="cursor-pointer"
                size="27"
              />
            </button>
          </div>

          <div class="overflow-y-auto h-[calc(100%-170px)]">
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center relative">
                <UAvatar size="md" :src="post.user.file" />
                <div class="ml-4">
                  <span class="font-bold text-[15px] mr-2">{{
                    post.user?.name
                  }}</span>
                  <span class="text-[15px] text-gray-900">
                    {{ post.text }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-if="post.comments"
              v-for="comment in post.comments"
              class="p-3"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <UAvatar size="md" :src="comment.user.file" />
                  <div class="ml-4 font-bold text-[15px]">
                    {{ comment.user.name }}
                    <span class="font-light text-gray-700 text-sm">{{
                      comment?.created_at
                    }}</span>
                  </div>
                </div>

                <Icon
                  v-if="$userStore.id == comment.user.id"
                  @click="
                    deleteType = 'Comment';
                    id = comment.id;
                  "
                  class="cursor-pointer"
                  name="mdi:dots-horizontal"
                  size="27"
                />
              </div>

              <div class="text-[13px] pl-14">{{ comment.text }}</div>
            </div>

            <div class="pb-16 md:hidden"></div>
          </div>

          <LikeSection v-if="post" class="px-2 border-t mb-2" :post="post" />

          <div
            class="absolute flex border bottom-0 w-full max-h-[200px] bg-white overflow-auto"
          >
            <Icon
              name="mdi:emoticon-happy-outline"
              class="pl-3 pt-2.5"
              size="40"
            />
            <UTextarea
              autoresize
              v-model="textarea"
              :rows="1"
              placeholder="Add a comment..."
              variant="none"
              class="w-full my-2 z-50 ring-0 text-gray-600 text-[18px]"
            />

            <button
              v-if="textarea && $userStore.id != post.user.id"
              class="text-blue-600 font-bold pr-4"
              @click="
                emits('addComment', {
                  post_id: post.id,
                  user_id: $userStore.id,
                  text: textarea,
                });
                textarea = '';
              "
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>

    <ShowPostOptionOverlay
      v-if="deleteType"
      :deleteType="deleteType"
      :id="id"
      @deleteSelected="emitEvent"
      @close="
        deleteType = null;
        id = null;
      "
    />
  </div>
</template>

<script setup>
const { $generalStore, $userStore } = useNuxtApp();
const props = defineProps(["post"]);
const { post } = toRefs(props);

const emits = defineEmits([
  "closeOverlay",
  "addComment",
  "updateLike",
  "deleteSelected",
]);

const textarea = ref("");
let deleteType = ref(null);
let id = ref();

const emitEvent = (event) => {
  emits("deleteSelected", {
    deleteType: event.deleteType,
    id: event.id,
    post: post.value,
  });
  deleteType = null;
  id = null;
};
</script>

<style></style>

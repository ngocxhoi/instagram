<template>
  <div class="flex z-20 items-center justify-between">
    <div class="flex items-center">
      <button
        class="pt-[10px]"
        :class="$userStore.id == post.user.id ? 'pointer-events-none' : ''"
      >
        <Icon
          @click="likePost()"
          v-if="!isHearActiveComputed"
          name="mdi:heart-outline"
          class="pl-3 cursor-pointer"
          size="40"
        />
        <Icon
          @click="unLikePost()"
          v-else
          name="mdi:heart"
          class="pl-3 cursor-pointer"
          color="#ff0000"
          size="40"
        />
      </button>
      <Icon name="mdi:comment-outline" class="pl-3 pt-[10px]" size="40" />
      <Icon name="mdi:share-variant" class="pl-3 pt-[10px]" size="40" />
    </div>

    <Icon name="mdi:bookmark-outline" class="pl-3 pt-[10px]" size="40" />
  </div>
</template>

<script setup>
const { $userStore } = useNuxtApp();

const props = defineProps(["post"]);
const emits = defineEmits(["like"]);

const { post } = toRefs(props);

let id = ref(null);
let isHearActiveComputed = computed(() => {
  let isTrue = false;
  for (let i = 0; i < post.value.likes?.length; i++) {
    const like = post?.value.likes[i];
    if (like.user_id == $userStore.id) {
      id.value = like.id;
      isTrue = true;
      break;
    }
  }
  return isTrue;
});

const likePost = async () => {
  try {
    await $userStore.likePost(post.value.id);
  } catch (error) {
    console.log(error);
  }
};
const unLikePost = async () => {
  try {
    await $userStore.unLikePost(id.value, post.value.id);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style></style>

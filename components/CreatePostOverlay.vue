<template>
  <div id="OverlaySection" class="fixed z-50 inset-0 bg-black/60 p-3">
    <button class="absolute right-3 cursor-pointer" @click="closeOverlay()">
      <Icon name="mdi:close" size="27" color="#fff" />
    </button>

    <div
      class="max-w-6xl h-[calc(100%-100px)] mx-auto mt-10 bg-white rounded-xl"
    >
      <div
        class="flex items-center justify-between w-full rounded-t-xl p-3 border-b border-b-gray-300"
      >
        <Icon
          name="mdi:arrow-left"
          size="30"
          color="#000"
          @click="closeOverlay()"
          class="cursor-pointer"
        />
        <div class="text-lg font-bold">New reel</div>
        <button
          @click="createPostFunc()"
          class="text-lg text-blue-500 hover:text-gray-900 font-bold"
        >
          Share
        </button>
      </div>

      <div class="w-full md:flex h-[calc(100%-55px)] rounded-xl overflow-auto">
        <div
          class="flex items-center bg-gray-100 w-full h-full overflow-hidden"
        >
          <div v-if="!fileDisplay" class="flex flex-col items-center mx-auto">
            <label
              for="file"
              class="hover:bg-blue-700 bg-blue-500 rounded-lg p-2.5 text-white font-bold cursor-pointer"
            >
              Select From Computer
            </label>

            <input type="file" hidden id="file" @input="getUploadImage" />

            <div
              v-if="error && error.file"
              class="text-red-500 text-center p-2 font-bold"
            >
              {{ error.file }}
            </div>
            <div
              v-if="!fileDisplay && isValidFile == false"
              class="text-red-500 text-center p-2"
            >
              File not accepted
            </div>
          </div>
          <NuxtImg
            v-if="fileDisplay && isValidFile == true"
            class="min-w-[400px] p-4 mx-auto"
            :src="fileDisplay"
            alt=""
          />
        </div>

        <div id="TextAreaSection" class="max-w-[720px] w-full relative">
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center">
              <NuxtImg
                class="rounded-full w-[38px] h-[38px]"
                :src="$userStore.file"
              />
              <div class="ml-4 font-extrabold text-[15px]">
                {{ $userStore.name }}
              </div>
            </div>
          </div>

          <div v-if="error?.text" class="text-red-500 p-2 font-extrabold">
            {{ error.text }}
          </div>

          <div class="flex w-full max-h-[200px] bg-white border-b">
            <textarea
              ref="textarea"
              v-model="form.text"
              placeholder="Write caption..."
              row="10"
              class="placeholder-gray-500 w-full border-0 my-2 p-2 z-50 outline-none text-gray-600 text-[16px]"
            ></textarea>
          </div>

          <div class="flex items-center justify-between border-b p-3">
            <div class="text-lg font-bold text-gray-500">Add Location</div>
            <Icon name="mdi:map-marker-outline" size="27" />
          </div>

          <div class="flex items-center justify-between border-b p-3">
            <div class="text-lg font-bold text-gray-500">Accesibility</div>
            <Icon name="mdi:chevron-down" size="27" />
          </div>

          <div class="flex items-center justify-between border-b p-3">
            <div class="text-lg font-bold text-gray-500">Advanced Setting</div>
            <Icon name="mdi:chevron-down" size="27" />
          </div>

          <div class="text-gray-500 mt-3 p-3 text-sm">
            Your reel will be shared with your followers in their feeds and can
            be seen on your profile.<br />It may also appear in places such as
            reels, where anyone can see it
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $userStore, $generalStore } = useNuxtApp();
const emit = defineEmits(["close"]);

const form = ref({
  text: null,
  file: null,
});

let isValidFile = ref(null);
let fileDisplay = ref();
let textarea = ref("");
let error = ref({
  text: null,
  file: null,
});

const closeOverlay = () => {
  form.value.text = null;
  form.value.file = null;
  fileDisplay.value = null;
  emit("close");
};

const getUploadImage = (e) => {
  form.value.file = e.target.files[0];
  let extension = form.value.file.name.substring(
    form.value.file.name.lastIndexOf(".") + 1
  );
  if (extension == "png" || extension == "jpg" || extension == "jpeg") {
    isValidFile.value = true;
  } else {
    isValidFile.value = false;
    return;
  }

  fileDisplay.value = URL.createObjectURL(e.target.files[0]);

  setTimeout(() => {
    document
      .getElementById("TextAreaSection")
      .scrollIntoView({ behavior: "smooth" });
  }, 300);
};

const createPostFunc = async () => {
  error.value.text = null;
  error.value.file = null;
  try {
    let data = new FormData();
    data.append("file", form.value.file || "");
    data.append("text", form.value.text);
    let dateRes = $userStore.createPost(data);
    await $generalStore.getAllUsersAndPosts();
    navigateTo("/");
    console.log(dateRes);
    closeOverlay();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style></style>

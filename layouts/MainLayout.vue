<template>
  <div id="MainLayout" class="w-screen min-h-screen bg-white">
    <div
      v-if="route.path === '/'"
      id="TopNavHome"
      class="fixed z-30 md:hidden block w-full bg-white h-[61px] border-b border-b-gray-300"
    >
      <div class="flex items-center justify-between h-full">
        <NuxtLink to="/">
          <NuxtImg
            src="/insta-logo.png"
            width="105"
            class="ml-6 cursor-pointer"
          />
        </NuxtLink>

        <div class="flex items-center w-1/2">
          <div class="flex items-center w-full bg-gray-100 rounded-lg">
            <Icon name="mdi:magnify" class="pl-4" size="27" color="#fff" />
            <input
              type="text"
              placeholder="Search"
              class="w-full bg-transparent placeholder-[#8e8e8e] border-0 ring-0 focus:ring-0"
            />
          </div>

          <Icon
            name="mdi:heart-outline"
            size="27"
            color="#000"
            class="pl-4 pr-3"
          />
        </div>
      </div>
    </div>

    <div
      v-if="route.path != '/'"
      id="TopNavUser"
      class="md:hidden fixed flex items-center justify-between z-30 w-full bg-white h-[61px] border-b border-b-gray-300"
    >
      <NuxtLink to="/" class="px-4">
        <Icon name="mdi:chevron-left" size="30" class="cursor-pointer" />
      </NuxtLink>
      <div class="font-extrabold text-lg">{{ $userStore.name }}</div>
      <Icon
        name="mdi:account-plus-outline"
        size="30"
        class="cursor-pointer px-4"
      />
    </div>

    <div
      id="SideNav"
      class="fixed h-full bg-white xl:w-[280px] w-[80px] md:block hidden border-r border-r-gray-300"
    >
      <NuxtLink to="/">
        <NuxtImg
          src="/insta-logo-small.png"
          class="xl:hidden block w-[25px] mt-10 ml-[25px] mb-10 cursor-pointer"
        />
        <NuxtImg
          src="/insta-logo.png"
          class="hidden xl:block w-[120px] mt-10 ml-6 mb-10 cursor-pointer"
        />
      </NuxtLink>

      <!-- Icon -->
      <div class="px-3">
        <NuxtLink to="/">
          <MenuItem iconString="Home" class="mb-4" />
        </NuxtLink>
        <NuxtLink to="">
          <MenuItem iconString="Search" class="mb-4" />
        </NuxtLink>
        <NuxtLink to="">
          <MenuItem iconString="Explore" class="mb-4" />
        </NuxtLink>
        <NuxtLink to="">
          <MenuItem iconString="Messages" class="mb-4" />
        </NuxtLink>
        <NuxtLink to="">
          <MenuItem iconString="Notifications" class="mb-4" />
        </NuxtLink>
        <NuxtLink to="" @click="openCreateOverlay()">
          <MenuItem iconString="Create" class="mb-4" />
        </NuxtLink>
        <NuxtLink v-if="$userStore.id">
          <UDropdown
            class="z-[100] lg:block hidden"
            :items="[
              [
                {
                  label: 'Profile',
                  icon: 'i-heroicons-user',
                  click() {
                    navigateTo('/profile/' + $userStore.id);
                  },
                },
              ],
              [
                {
                  label: 'Log out',
                  icon: 'i-heroicons-arrow-right-start-on-rectangle',
                  async click() {
                    await $userStore.logout();
                    reloadNuxtApp();
                  },
                },
              ],
            ]"
            :popper="{ placement: 'right-start' }"
          >
            <MenuItem iconString="Profile" class="mb-4" />
          </UDropdown>
          <MenuItem
            @click="navigateTo('/profile/' + $userStore.id)"
            iconString="Profile"
            class="mb-4 lg:hidden block"
          />
        </NuxtLink>
        <NuxtLink v-else>
          <UDropdown
            class="z-[100] lg:block hidden"
            :popper="{ placement: 'right-start' }"
            :items="[
              [
                {
                  label: 'Log in',
                  icon: 'i-heroicons-arrow-right-end-on-rectangle',
                  click() {
                    navigateTo('/guest');
                  },
                },
                {
                  label: 'Get user',
                  icon: 'i-heroicons-user',
                  click() {
                    $userStore.getUser();
                  },
                },
              ],
            ]"
          >
            <div class="ml-2 flex items-center">
              <UAvatar src="/user-placeholder.png" />
              <span
                class="xl:block hidden text-black/80 font-bold text-[18px] pl-2 mt-0.5"
              >
                User
              </span>
            </div>
          </UDropdown>
          <div
            @click="navigateTo('/guest')"
            class="ml-2 lg:hidden flex items-center"
          >
            <UAvatar src="/user-placeholder.png" />
            <span
              class="xl:block hidden text-black/80 font-bold text-[18px] pl-2 mt-0.5"
            >
              User
            </span>
          </div>
        </NuxtLink>
      </div>

      <a
        @click="
          $userStore.logout();
          navigateTo('/');
          reloadNuxtApp();
        "
        class="absolute bottom-0 px-3 w-full"
      >
        <MenuItem iconString="Log out" class="mb-4" />
      </a>
    </div>

    <div
      class="flex lg:justify-between bg-white h-full w-full xl:pl-[280px] lg:pl-[100px]"
    >
      <div
        class="mx-auto md:mt-6 mt-20"
        :class="route.path == '/' ? 'lg:w-8/12 w-full' : 'max-w-[1200px]'"
      >
        <main>
          <slot />
        </main>
      </div>

      <div
        v-if="route.path == '/'"
        id="SuggestionSection"
        class="lg:w-4/12 lg:block hidden text-black mt-9"
      >
        <NuxtLink to="" class="flex items-center justify-between max-w-[300px]">
          <div class="flex items-center">
            <NuxtImg
              class="rounded-full w-[58px] h-[58px]"
              src="/user-placeholder.png"
            />
            <div class="pl-4">
              <div class="text-black font-bold">NAME HERE</div>
              <div class="text-gray-500 text-bold">NAME HERE</div>
            </div>
          </div>

          <button class="text-blue-500 hover:text-gray-900 text-xs font-bold">
            Switch
          </button>
        </NuxtLink>

        <div class="max-w-[300px] flex items-center justify-between py-3">
          <div class="text-gray-500 font-bold">Suggestions for you</div>
          <button class="text-blue-500 hover:text-gray-900 text-xs font-bold">
            See All
          </button>
        </div>

        <NuxtLink
          v-for="suggest in $generalStore.suggested"
          :to="`/profiles/${suggest.id}`"
          class="flex items-center justify-between max-w-[300px] pb-2"
        >
          <div class="flex items-center">
            <UAvatar :src="suggest.file" size="lg" />
            <div class="pl-4">
              <div class="text-black font-bold truncate">
                {{ suggest.name }}
              </div>
              <div class="text-gray-500 text-bold">
                {{ $generalStore.allLowerCaseNoCaps(suggest.name) }}
              </div>
            </div>
          </div>

          <button class="text-blue-500 hover:text-gray-900 text-xs font-bold">
            Follow
          </button>
        </NuxtLink>

        <div class="max-w-[300px] mt-5">
          <div class="text-sm text-gray-400">
            About Help Press API Jobs Privacy Terms Locations Language Meta
            Verified
          </div>
          <div class="text-left text-gray-400 mt-4">
            © 2023 INSTAGRAM FROM META
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <div
      id="BottomNav"
      class="fixed z-30 bottom-0 w-full md:hidden flex items-center justify-around bg-white border-t py-2 border-r-gray-300"
    >
      <NuxtLink to="/">
        <Icon
          name="mdi:home-outline"
          size="33"
          color="#000"
          class="cursor-pointer"
        />
      </NuxtLink>
      <NuxtLink to="">
        <Icon
          name="mdi:compass"
          size="33"
          color="#000"
          class="cursor-pointer"
        />
      </NuxtLink>
      <NuxtLink to="">
        <Icon
          name="mdi:send-outline"
          size="33"
          color="#000"
          class="cursor-pointer"
        />
      </NuxtLink>
      <NuxtLink @click="openCreateOverlay()">
        <Icon name="mdi:plus" size="33" color="#000" class="cursor-pointer" />
      </NuxtLink>
      <NuxtLink to="">
        <Icon
          name="mdi:account-outline"
          size="33"
          color="#000"
          class="cursor-pointer"
        />
      </NuxtLink>
      <NuxtLink :to="`/profile/${$userStore.id}`">
        <NuxtImg
          class="rounded-full w-[30px] cursor-pointer"
          src="/user-placeholder.png"
        />
      </NuxtLink>
    </div>
  </div>

  <CreatePostOverlay v-if="showCreatePost" @close="showCreatePost = false" />
</template>

<script setup>
const route = useRoute();
const { $userStore, $generalStore } = useNuxtApp();

let showCreatePost = ref(false);

const openCreateOverlay = () => {
  if ($userStore.id) showCreatePost.value = true;
  else navigateTo("/guest");
};

// onMounted(async () => {
//   try {
//     await $userStore.getTokens();
//   } catch (error) {
//     console.log(error);
//   }
// });
</script>

<style></style>

<template>
  <GuestLayout>
    <NuxtImg src="/insta-logo.png" class="mx-auto pt-8 pb-10" width="200" />

    <form>
      <!-- Login -->
      <div v-if="isLogin" class="mt-4">
        <UInput
          size="xl"
          autofocus
          type="email"
          placeholder="Email"
          v-model="formLogin.email"
          :ui="{
            variant: {
              outline:
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm',
            },
          }"
        />
        <InputError
          class="mt-2"
          :message="errors && errors.email ? errors.email[0] : ''"
        />
      </div>
      <div v-if="isLogin" class="mt-4">
        <UInput
          size="xl"
          type="password"
          placeholder="Password"
          v-model="formLogin.password"
          :ui="{
            variant: {
              outline:
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm',
            },
          }"
        />
      </div>

      <!-- Register -->
      <div v-if="!isLogin" class="mt-4">
        <UInput
          size="xl"
          autofocus
          type="text"
          placeholder="Name"
          v-model="formRegister.name"
          :ui="{
            variant: {
              outline:
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm',
            },
          }"
        />
        <InputError
          class="mt-2"
          :message="errors && errors.name ? errors.name[0] : ''"
        />
      </div>
      <div v-if="!isLogin" class="mt-4">
        <UInput
          size="xl"
          autofocus
          type="email"
          placeholder="Email"
          v-model="formRegister.email"
          :ui="{
            variant: {
              outline:
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm',
            },
          }"
        />
        <InputError
          class="mt-2"
          :message="errors && errors.email ? errors.email[0] : ''"
        />
      </div>
      <div v-if="!isLogin" class="mt-4">
        <UInput
          size="xl"
          type="password"
          placeholder="Password"
          v-model="formRegister.password"
          :ui="{
            variant: {
              outline:
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm',
            },
          }"
        />
        <InputError
          class="mt-2"
          :message="errors && errors.password ? errors.password[0] : ''"
        />
      </div>
      <div v-if="!isLogin" class="mt-4">
        <UInput
          size="xl"
          type="password"
          placeholder="Confirm Password"
          v-model="formRegister.password_confirmation"
          :ui="{
            variant: {
              outline:
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm',
            },
          }"
        />
        <InputError
          class="mt-2"
          :message="
            errors && errors.password_confirmation
              ? errors.password_confirmation[0]
              : ''
          "
        />
      </div>

      <UButton
        v-if="isLogin"
        @click="login()"
        block
        class="mt-4 bg-[--btn-color] hover:bg-[--btn-hover] p-1.5 text-lg font-bold"
        label="Login"
      />
      <UButton
        v-else
        @click="register()"
        block
        class="mt-4 bg-[--btn-color] hover:bg-[--btn-hover] p-1.5 text-lg font-bold"
        label="Register"
      />

      <div class="flex items-center justify-center mt-4">
        <NuxtLink
          v-if="isLogin"
          to="/guest/reset-password"
          class="text-sm text-gray-600 hover:text-gray-900 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Forgot your password?
        </NuxtLink>
        <NuxtLink
          v-else
          @click="isLogin = !isLogin"
          class="text-sm text-gray-600 hover:text-gray-900 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Already registered?
        </NuxtLink>
      </div>

      <div class="flex items-center justify-center mt-4">
        <span v-if="isLogin">Don't have an account?</span>
        <span v-else>Have an account?</span>
        <a
          @click="(isLogin = !isLogin), (errors = null)"
          class="cursor-pointer pl-1 font-bold text-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span v-if="isLogin">Sign up</span>
          <span v-else>Log in</span>
        </a>
      </div>
    </form>
  </GuestLayout>
</template>

<script setup>
import GuestLayout from "~/layouts/GuestLayout.vue";
const { $userStore } = useNuxtApp();

let isLogin = ref(true);
useHead({
  title: isLogin ? "Login" : "Register",
});

let errors = ref();

const formLogin = ref({
  email: "sasha.gleason@example.org ",
  password: "123123123",
});
const formRegister = ref({
  name: "user1",
  email: "user1@example.com",
  password: "123123123",
  password_confirmation: "123123123",
});

const login = async () => {
  errors.value = null;

  try {
    let dataRes = await $userStore.login(formLogin.value);
    const responses = dataRes.responses?._data?.errors;
    if (responses) throw responses;
    console.log(dataRes);
    let res = await $userStore.getUser();
    navigateTo("/");
    console.log(res);
  } catch (error) {
    errors.value = error;
    console.log(error);
  }
};

const register = async () => {
  errors.value = null;

  try {
    let dataRes = await $userStore.register(formRegister.value);
    const responses = dataRes.responses._data?.errors;
    if (responses) throw responses;
    let res = await $userStore.getUser();
    navigateTo("/");
  } catch (error) {
    errors.value = error;
    console.log(error);
  }
};

onMounted(async () => {
  try {
    await $userStore.getTokens();
  } catch (error) {
    console.log(error);
  }
});
</script>

<style></style>

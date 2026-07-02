<script setup>
import {useRouter} from "vue-router";
import {reactive} from "vue";
import {alertError, alertSuccess} from "../../lib/alert.js";
import {userRegister} from "../../lib/api/UserApi.js";

const router = useRouter();
const user = reactive({
  username: "",
  password: "",
  confirm_password: "",
  name: "",
  work_position: "",
})

async function handleSubmit() {
  if (user.password !== user.confirm_password) {
    await alertError("Passwords do not match.")
    return;
  }

  const response = await userRegister(user)
  const responseBody = await response.json()
  console.log(responseBody)

  if (response.status === 200) {
    await alertSuccess("User registered successfully.")
    await router.push({
      path: "/login"
    })
  } else {
    await alertError(responseBody.errors)
  }
}

</script>

<template>
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">

    <div class="text-center">
      <div class="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
        <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
      </div>
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
        Create Account
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Register your system access
      </p>
    </div>

    <form class="mt-8 space-y-5" v-on:submit.prevent="handleSubmit">

      <div>
        <label for="full-name" class="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input id="full-name" name="full-name" type="text" required v-model="user.name"
               class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
               placeholder="Enter your full name">
      </div>

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input id="username" name="username" type="text" required v-model="user.username"
               class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
               placeholder="Enter your username">
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input id="password" name="password" type="password" required v-model="user.password"
               class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
               placeholder="Enter your password">
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input id="confirm-password" name="confirm-password" type="password" required v-model="user.confirm_password"
               class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
               placeholder="Re-enter your password">
      </div>

      <div>
        <label for="work-position" class="block text-sm font-medium text-gray-700 mb-1">
          Work Position
        </label>
        <select id="work-position" name="work-position" type="text" required v-model="user.work_position"
            class="block w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5">
          <option>Manager</option>
          <option selected>Foreman</option>
          <option>Supervisor</option>
          <option>Inspector</option>
        </select>
      </div>

      <div class="pt-2">
        <button type="submit"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg">
          Register
        </button>
      </div>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Already have an account?
          <RouterLink to="/login"
             class="font-medium text-blue-600 hover:text-blue-500 hover:underline transition duration-150">
            Log in here
          </RouterLink>
        </p>
      </div>

    </form>
  </div>
</template>

<style scoped>

</style>


<script setup>
import {useRouter} from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import {reactive} from "vue";
import {userLogin} from "../../lib/api/UserApi.js";
import {alertError} from "../../lib/alert.js";
import BaseButtonBack from "../Utilities/UtilitiesHome/ButtonBack.vue";

const router = useRouter();
const token = useLocalStorage("token", "")
const user = reactive({
  username: "",
  password: "",
})

async function handleSubmit() {
  try {
    const response = await userLogin(user);
    const responseBody = await response.json().catch(() => ({}));
    console.log(responseBody);

    if (response.status === 200 && responseBody?.data?.token) {
      token.value = responseBody.data.token;
      await router.push({
        path: "/dashboard"
      })
    } else {
      await alertError(responseBody.errors || "ログインに失敗しました")
    }
  } catch (e) {
    await alertError("APIに接続できません。バックエンドを確認してください。")
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative">
    <div class="absolute top-4 left-4">
      <BaseButtonBack/>
    </div>
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          土木部ホームページ
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          ログインしてプロジェクトダッシュボードをご利用ください
        </p>
      </div>

      <form class="mt-8 space-y-6" v-on:submit.prevent="handleSubmit">
        <div class="space-y-4">

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              ユーザー名
            </label>
            <input id="username" name="username" type="text" autocomplete="username" required v-model="user.username"
                   class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
                   placeholder="ユーザー名を入力してください">
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="user.password"
                   class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
                   placeholder="パスワードを入力してください">
          </div>
        </div>
        <div>
          <button type="submit"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg">
            ログイン
          </button>
        </div>
      </form>
    </div>
  </div>

</template>

<style scoped>

</style>
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
  role: "Manager",
})

async function handleSubmit() {
  if (user.password !== user.confirm_password) {
    await alertError("Passwords do not match.")
    return;
  }

  try {
    const response = await userRegister(user)
    const responseBody = await response.json().catch(() => ({}))
    console.log(responseBody)

    if (response.status === 200) {
      await alertSuccess("User registered successfully.")
      await router.push({
        path: "/login"
      })
    } else {
      await alertError(responseBody.errors || "登録に失敗しました。")
    }
  } catch (e) {
    await alertError("APIに接続できません。バックエンドを確認してください。")
  }
}

</script>

<template>
<div class="min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">

    <div class="text-center">
      <div class="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
        <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
      </div>
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
        アカウント作成
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        システムアクセスを登録する
      </p>
    </div>

    <form class="mt-8 space-y-5" v-on:submit.prevent="handleSubmit">

      <div>
        <label for="full-name" class="block text-sm font-medium text-gray-700 mb-1">
          名前
        </label>
        <input id="full-name" name="full-name" type="text" required v-model="user.name"
               class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
               placeholder="お名前を入力してください">
      </div>

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
          ユーザー名
        </label>
        <input id="username" name="username" type="text" required v-model="user.username"
               class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
               placeholder="ユーザーを入力してください">
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          パスワード
        </label>
        <input id="password" name="password" type="password" required v-model="user.password"
               class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
               placeholder="パスワード作成">
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          パスワード確認
        </label>
        <input id="confirm-password" name="confirm-password" type="password" required v-model="user.confirm_password"
               class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
               placeholder="もう一度確認">
      </div>

      <div>
        <label for="work-position" class="block text-sm font-medium text-gray-700 mb-1">
          役職
        </label>
        <select id="work-position" name="work-position" required v-model="user.role"
                class="block w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5">
          <option value="Manager">管理</option>
          <option value="Foreman">事務員</option>
          <option value="Supervisor">部長</option>
          <option value="Inspector">課長</option>
        </select>
      </div>

      <div class="pt-2">
        <button type="submit"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg">
          作成
        </button>
      </div>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          アカウントをお持ちの場合
          <RouterLink to="/login"
                      class="font-medium text-blue-600 hover:text-blue-500 hover:underline transition duration-150">
            こちらログイン
          </RouterLink>
        </p>
      </div>

    </form>
  </div>
</div>

</template>

<style scoped>

</style>

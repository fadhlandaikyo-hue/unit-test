<script setup>
import {useLocalStorage} from "@vueuse/core";
import {onBeforeMount, ref} from "vue";
import {
  userDetail,
  userDetailName, userDetailRole,
  userUpdatePassword,
  userUpdateProfile,
} from "../../lib/api/UserApi.js";
import {alertError, alertSuccess} from "../../lib/alert.js";
import BaseSidebar from "../UserComponents/SidebarUser.vue";

const token = useLocalStorage('token', "")
const userName = ref("")
const name = ref("")
const password = ref("")
const confirm_password = ref("")
const role = ref("")

async function fetchUserName() {
  const response = await userDetailName(token.value);
  const responseBody = await response.json();
  console.log(responseBody);

  if (response.status === 200) {
    userName.value = responseBody.data.username;
  } else {
    await alertError(responseBody.errors)
  }
}

async function fetchUserRole() {
  const response = await userDetailRole(token.value);
  const responseBody = await response.json();
  console.log(responseBody);

  if (response.status === 200) {
    role.value = responseBody.data.role;
  } else {
    await alertError(responseBody.errors)
  }
}

async function fetchUser() {
  const response = await userDetail(token.value);
  const responseBody = await response.json();
  console.log(responseBody);

  if (response.status === 200) {
    name.value = responseBody.data.name;
  } else {
    await alertError(responseBody.errors)
  }
}

async function handleChangeName() {
  const response = await userUpdateProfile(token.value, {
    name: name.value,
    role: role.value,
  });
  const responseBody = await response.json();
  console.log(responseBody);

  if (response.status === 200) {
    await alertSuccess("Profile updated successfully.");
  } else {
    await alertError(responseBody.errors)
  }
}


async function handleChangePassword() {
  if (password.value !== confirm_password.value) {
    await alertError("変更失敗");
    return;
  }

  const response = await userUpdatePassword(token.value, {password: password.value});
  const responseBody = await response.json();
  console.log(responseBody);

  if (response.status === 200) {
    password.value = "";
    confirm_password.value = "";
    await alertSuccess("Password updated successfully.");
  } else {
    await alertError(responseBody.errors)
  }
}

onBeforeMount(async () => {
  await fetchUser();
  await fetchUserName();
  await fetchUserRole();
})

</script>

<template>
  <div class="flex h-full">

    <main class="flex-1 overflow-y-auto p-6 lg:p-10">

      <div class="mb-8 flex items-center">
        <RouterLink to="/dashboard"
                    class="mr-4 p-2 bg-white rounded-full text-gray-500 hover:text-blue-600 shadow-sm border border-gray-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </RouterLink>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">プロフィル</h1>
          <p class="text-gray-500 text-sm">プロフィールおよびセキュリティ設定を管理します</p>
        </div>
      </div>

      <div class="space-y-6">

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-100 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-800">ユーザープロフィール</h2>
            <p class="text-xs text-gray-500">アカウント管理者に表示される基本情報</p>
          </div>

          <div class="p-6">
            <form class="space-y-6" v-on:submit.prevent="handleChangeName">

              <div class="flex items-center space-x-6">
                <div class="shrink-0 relative">
                  <img class="h-20 w-20 object-cover rounded-full border-2 border-white shadow-md"
                       src="/img/profile.png" alt="Current profile photo">
                  <button type="button"
                          class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 border-2 border-white shadow-sm"
                          title="Change Photo">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">写真</label>
                  <div class="mt-1 flex items-center space-x-3">
                    <button type="button"
                            class="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                      投稿
                    </button>
                    <button type="button" class="text-sm text-red-600 hover:text-red-800 font-medium">削除</button>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700">ユーザー名</label>
                  <div class="mt-1">
                    <input type="text" name="username" id="username"
                           class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5 bg-gray-50"
                           readonly v-model="userName">
                    <p class="mt-1 text-xs text-gray-400">ユーザー名は変更できません。</p>
                  </div>
                </div>

                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">氏名</label>
                  <div class="mt-1">
                    <input type="text" name="name" id="name"
                           class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5"
                           v-model="name">
                  </div>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">メールアドレス</label>
                  <div class="mt-1">
                    <input type="email" name="email" id="email" value="admin@konstruksitrack.id"
                           class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5">
                  </div>
                </div>

                <div>
                  <label for="role" class="block text-sm font-medium text-gray-700">役割</label>
                  <div class="mt-1">
                    <select v-model="role"
                            class="block w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5">
                      <option value="Manager">部長</option>
                      <option value="Foreman">課長</option>
                      <option value="Supervisor">事務員</option>
                      <option value="Inspector">管理</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button type="submit"
                        class="bg-blue-600 border border-transparent rounded-lg shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-100 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-800">パスワードを変更</h2>
            <p class="text-xs text-gray-500">アカウントを安全に保つため、強力なパスワードを使用してください</p>
          </div>

          <div class="p-6">
            <form class="space-y-5 max-w-2xl" v-on:submit.prevent="handleChangePassword">

              <div>
                <label for="new_password" class="block text-sm font-medium text-gray-700">新しいパスワード</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input type="password" name="new_password" id="new_password"
                         class="block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5"
                         placeholder="新しいパスワードを入力してください" v-model="password">
                </div>
              </div>

              <div>
                <label for="confirm_password"
                       class="block text-sm font-medium text-gray-700">新しいパスワード（再入力）</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input type="password" name="confirm_password" id="confirm_password"
                         class="block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5"
                         placeholder="新しいパスワードを再入力してください" v-model="confirm_password">
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button type="button"
                        class="bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3">
                  キャンセル
                </button>
                <button type="submit"
                        class="bg-blue-600 border border-transparent rounded-lg shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                  パスワードを更新する
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

      <div class="mt-10 text-center text-xs text-gray-400 pb-4">
        &copy; 2026年 建設システム
      </div>

    </main>
    <BaseSidebar/>
  </div>
</template>

<style scoped>

</style>



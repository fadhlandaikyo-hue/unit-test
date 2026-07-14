<script setup>
import {useLocalStorage} from "@vueuse/core";
import {useRouter} from "vue-router";
import {userLogout} from "../../lib/api/UserApi.js";
import {onBeforeMount} from "vue";

const token = useLocalStorage("token", "")
const router = useRouter()

async function handleLogout(){
  try {
    if (token.value) {
      await userLogout(token.value);
    }
  } finally {
    token.value = "";
    await router.push({
      path: "/home"
    })
  }
}

onBeforeMount(async () => {
  await handleLogout();
})
</script>

<template>

</template>

<style scoped>

</style>

<script setup>
import {useLocalStorage} from "@vueuse/core";
import {useRouter} from "vue-router";
import {userLogout} from "../../lib/api/UserApi.js";
import {alertError} from "../../lib/alert.js";
import {onBeforeMount} from "vue";

const token = useLocalStorage("token", "")
const router = useRouter()

async function handleLogout(){
  const response = await userLogout(token.value);
  const responseBody = await response.json();
  console.log(responseBody);

  if(response.status === 200){
    token.value = "";
    await router.push({
      path: "/home"
    })
  } else {
    await alertError(responseBody.errors)
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



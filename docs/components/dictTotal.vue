<template>
  <pre class="dict-tatol" style="padding: 0">
    <code style="padding: 0;display: unset;">
create-time     : 2019/10/29 15:29:00
author          : simply-none
vocabulary-origin: Sass official website
complete-in-sass-time: 2019/11/12 09:41:11
version         : 0.0.1-alpha
skills          : separating-words like downleveling to down-leveling

migrated-to-webstorm-time: 2020/07/02 17:56:00
version         : 0.0.2-alpha
migrated-to-latest-blogs-time: 2022/04/27 20:18:15
version         : 0.1.0-beta

vocabulary total：<b id="vocabulary-total" style="font-weight: 100;">{{ dictCount }}</b>
    </code>
  </pre>
</template>

<script setup>
import { onMounted, ref } from "vue";

let dictCount = ref(0);

onMounted(() => {
  let dictTable = document.querySelector(".main table");
  dictCount.value = (dictTable.querySelectorAll("tr") || []).length;
});
</script>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const count = ref(0)

function increment () {
  count.value++
}

onMounted(() => {
  console.log(`初始值：${count.value}`)
})
</script>

<template>
  <button @click="increment">点击{{ count }}</button>
</template>
<script setup>
import gradient from "generate-random-gradient";
function applyGradient(e) {
  e.target.style.background = gradient();
}

function randomColor() {
    const r = randomInt(255)
    const g = randomInt(255)
    const b = randomInt(255)
    const c = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}000`
    return c.slice(0, 7)
}

function randomInt(max) {
    return Math.floor(Math.random() * max)
}

function randomBgImg() {
  const deg = randomInt(360)
  document.body.style.background = `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`
}

randomBgImg()

</script>

<template>
  <div id="app">
    <button @click="applyGradient">Hello!</button>
  </div>
</template>

<style>
</style>

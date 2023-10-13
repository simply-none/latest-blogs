<script setup>
import { onMounted } from "vue";
import { ElButton } from "element-plus";
import pkg from '../../package.json'
function applyGradient(e) {
  const SL = ", 100%, 85%";
  let to = Math.floor(Math.random() * 255)
  let from = Math.floor(Math.random() * 255)
  if (Math.abs(to - from) < 50) {
    let temp = to + Math.floor(Math.random() * 20 + 50)
    from = temp > 255 ? to - Math.floor(Math.random() * 20 + 50) : temp
  }
  const bgc = `
    linear-gradient(
      to left bottom,
      hsl(${to + SL}) 0%,
      hsl(${from + SL}) 100%
    )
  `;
  document.querySelector("#app1").style.background = bgc;
}

onMounted(() => {
  applyGradient();
});
</script>

<template>
  <div id="app1">
    <section class="cover show">
      <div class="mask"></div>
      <div class="cover-main">
        <p class="cover-main-icon">
          <img src="/icon.svg" data-origin="_media/icon.svg" alt="logo" />
        </p>
        <h1 id="docsify-4131">
          <a href="#/?id=docsify-4131" data-id="docsify-4131" class="anchor"
            ><span>璎耜 <small>v{{ pkg.version }}</small></span></a
          >
        </h1>
        <p class="cover-main-icon">
          <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg"/>
        </p>

        <blockquote>
          <p>记录工作、居家过程中学习到的知识点与一些人生思考</p>
        </blockquote>
        <ul>
          <li>当初凌然非势境，不道未了轻松，旧字浮沉心绪浓</li>
          <li>佳期独怅惘，故梦已成空</li>
        </ul>
        <p>
          <el-link
            href="https://github.com/simply-none/latest-blogs"
            target="_blank"
            rel="noopener"
            :underline="false"
            >GitHub</el-link
          >
          <el-link href="./usage-frame/技术栈工具链" :underline="false">Getting Started</el-link>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
#app1 {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  background: rebeccapurple;
}
section.cover {
  position: relative;
  align-items: center;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  display: none;
}

.cover-main-icon {
  display: flex;
  align-content: center;
  justify-content: center;
}
section.cover.show {
  display: flex;
}
section.cover .cover-main {
  flex: 1;
  margin: 0 16px;
  text-align: center;
  position: relative;
}
img {
  max-width: 100%;
}
section.cover h1 {
  color: inherit;
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0.625rem 0 2.5rem;
  position: relative;
  text-align: center;
}
section.cover h1 a {
  display: block;
}
section.cover a,
section.cover a:hover {
  text-decoration: none;
}
section.cover a {
  color: inherit;
}
section.cover h1 small {
  bottom: -0.4375rem;
  font-size: 1rem;
  position: absolute;
}
section.cover blockquote {
  font-size: 1.5rem;
  text-align: center;
}
section.cover p {
  line-height: 1.5rem;
  margin: 1em 0;
}
section.cover ul {
  line-height: 1.8;
  list-style-type: none;
  margin: 1em auto;
  max-width: 500px;
  padding: 0;
}
section.cover p {
  line-height: 1.5rem;
  margin: 1em 0;
}
section.cover .cover-main > p:last-child a {
  border-radius: 2rem;
  border: 1px solid #42b983;
  border-color: var(--theme-color, #42b983);
  box-sizing: border-box;
  color: #42b983;
  color: var(--theme-color, #42b983);
  display: inline-block;
  font-size: 1.05rem;
  letter-spacing: 0.1rem;
  margin: 0.5rem 1rem;
  padding: 0.75em 2rem;
  text-decoration: none;
  transition: all 0.15s ease;
}
section.cover .cover-main > p:last-child a:last-child {
  background-color: #42b983;
  background-color: var(--theme-color, #42b983);
  color: #fff;
}
</style>

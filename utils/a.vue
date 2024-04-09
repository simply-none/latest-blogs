<!--
 * @Author: 简隐 jousindea@163.com
 * @Date: 2024-03-31 19:29:53
 * @LastEditors: 简隐 jousindea@163.com
 * @LastEditTime: 2024-04-10 01:12:01
 * @FilePath: \latest-blogs\utils\a.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 简隐, All Rights Reserved. 
-->
<template>
  <em v-if="!currentFileCommit.length" opacity="70">
    <el-button type="primary" plain @click="onShowAllCommit(true)">展开</el-button>
    <!-- <div v-if="!showAllCommit">
      上一次提交：
      <pre>{{ currentFileCommit[0] }}</pre>
    </div> -->
  </em>
  <div v-else :class="['bg-$vp-custom-block-details-bg']" rounded-lg p-4>

    <div class="grid grid-cols-[30px_auto] mt-3 gap-1.5 children:my-auto -ml-1.5" text="<sm:xs">
      <template v-for="commit of currentFileCommit" :key="commit.hash">
        <template v-if="commit.tag && !commit.tag.startsWith('HEAD')">
          <div class="m-auto h-[1.75em] w-[1.75em] inline-flex rounded-full bg-gray-400/10 opacity-90">
            <div class="i-octicon:rocket-16 !h-[50%] !min-h-[50%] !min-w-[50%] !w-[50%]" m="auto" />
          </div>
          <div flex items-center gap-1>
            <a :href="commit.tag" target="_blank">
              <code class="font-bold">{{ commit.tag }}</code>
            </a>
            <ClientOnly>
              <span>: </span>
              <span>{{ commit.rawBody }}</span>,
              <span>[{{ commit.committerName }}]</span>
              <span>({{ commit.committerDate }})</span>
            </ClientOnly>
          </div>
        </template>
        <template v-else>
          <div class="i-octicon:git-commit-16 m-auto rotate-90 transform opacity-30" />
          <div flex items-center gap-1>
            <a :href="`${commit.repo_url}/commit/${commit.hash}`" target="_blank">
              <code class="text-xs text-$vp-c-brand-1 hover:text-$vp-c-brand-1" transition="color ease-in-out"
                duration-200>
                {{ commit.abbrevHash }}
              </code>
            </a>
            <span>: </span>
            <span>{{ commit.rawBody }}</span>,
            <span>[{{ commit.committerName }}]</span>
            <span>({{ commit.committerDate }})</span>
          </div>
        </template>
      </template>
    </div>
    <ElButton type="primary" plain @click="onShowAllCommit(false)">收起</ElButton>
  </div>
</template>



<script setup>
import { ElButton } from "element-plus";
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute } from "vitepress";

import Changelog from 'virtual:git-changelog'

const route = useRoute();

let showAllCommit = ref(false);

function onShowAllCommit(show) {
  showAllCommit.value = show;
  if (showAllCommit.value) {
    filterCommit();
  } else {
    currentFileCommit.value = []
  }
}

let currentFileCommit = ref([]);

function useRawPath(route) {
  return computed(() => {
    let path = decodeURIComponent(route.path);
    if (path.startsWith("/")) path = path.replace("/latest-blogs", "docs");

    if (path.endsWith("/")) path += "index.md";
    else path = path.replace(/^(.+?)(\.html)?$/s, "$1.md");
    return path;
  });
}

function filterCommit() {
  let path = useRawPath(route);
  console.log(Changelog, 'changelog')

  currentFileCommit.value = Changelog.commits[path.value] || []
}

onMounted(() => {
  filterCommit()
});

const props = defineProps({
  id: String,
});
</script>

<style scoped>
.vp-nolebase-git-changelog-title {
  color: var(--vp-custom-block-details-text);
  font-size: var(--vp-custom-block-font-size);
}

.vp-nolebase-git-changelog-title:hover {
  color: var(--vp-c-brand-1);
}

.vp-nolebase-git-changelog-last-edited-title {
  font-weight: 800;
}

.vp-nolebase-git-changelog-view-full-history-title {
  font-weight: 400;
}
</style>
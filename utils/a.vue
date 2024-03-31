<!--
 * @Author: 简隐 jousindea@163.com
 * @Date: 2024-03-31 19:29:53
 * @LastEditors: 简隐 jousindea@163.com
 * @LastEditTime: 2024-04-01 00:32:05
 * @FilePath: \latest-blogs\utils\a.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 简隐, All Rights Reserved. 
-->
<template>
  <em v-if="!currentFileCommit.length" opacity="70">{{ 'nona' }}</em>
  <div
    v-else
    :class="[
      'bg-$vp-custom-block-details-bg',
    ]"
    rounded-lg p-4
  >
      <div
        class="grid grid-cols-[30px_auto] mt-3 gap-1.5 children:my-auto -ml-1.5"
        text="<sm:xs"
      >
        <template v-for="(commit) of currentFileCommit" :key="commit.hash">
          <template v-if="commit.tag">
            <div class="m-auto h-[1.75em] w-[1.75em] inline-flex rounded-full bg-gray-400/10 opacity-90">
              <div class="i-octicon:rocket-16 !h-[50%] !min-h-[50%] !min-w-[50%] !w-[50%]" m="auto" />
            </div>
            <div flex items-center gap-1>
              <a :href="commit.tag" target="_blank">
                <code class="font-bold">{{ commit.tag }}</code>
              </a>
              <ClientOnly>
                <span class="text-xs opacity-50">
                  {{ commit.authorDate }}
                </span>
              </ClientOnly>
            </div>
          </template>
          <template v-else>
            <div class="i-octicon:git-commit-16 m-auto rotate-90 transform opacity-30" />
            <div flex items-center gap-1>
              <a :href="`${commit.repo_url}/commit/${commit.hash}`" target="_blank">
                <code
                  class="text-xs text-$vp-c-brand-1 hover:text-$vp-c-brand-1"
                  transition="color ease-in-out"
                  duration-200
                >
                  {{ commit.hash.slice(0, 5) }}
                </code>
              </a>
              <template v-for="sub in commit" :key="sub.hash">
                <span>-</span>
                <span>
                    <span class="text-xs opacity-50" >
                      {{ sub }}
                    </span>
                </span>
              </template>
            </div>
          </template>
        </template>
      </div>
  </div>
</template>

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


<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'

// import Changelog from 'virtual:git-changelog'

let currentFileCommit = ref([])

function useRawPath() {
  const route = useRoute()
  console.log(route)

  return computed(() => {
    let path = decodeURIComponent(route.path).toLowerCase()
    if (path.startsWith('/'))
      path = path.replace('/latest-blogs', 'docs')

    if (path.endsWith('/'))
      path += 'index.md'
    else
      path = path.replace(/^(.+?)(\.html)?$/s, '$1.md')

    return path.toLowerCase()
  })
}

function filterCommit () {
  let path = useRawPath()
  console.log(path)
  const fileLogs = Changelog.commits.reduce((pre, cur) => {
    // console.log(pre, 'pre')
    
    console.log(JSON.stringify(cur), 'cur')
    cur.files.map(file => {
      if (!pre[file]) {
        pre[file] = []
      }
      if (!path.value.startsWith('docs') || !path.value.endsWith('.md')) {
        return false
      }
      delete cur.files
      pre[file].push(cur)
    })

    return pre
  })

  console.log(JSON.stringify(fileLogs[path.value]), 'fileLogs[path.value]')
  currentFileCommit.value = fileLogs[path.value].sort(function(a, b) {
    return new Date(a.authorDate) - new Date(b.authorDate) < 0 ? 1 : -1
  })


  console.log(currentFileCommit,'logs')
}

onMounted(() => {
    // filterCommit()
})

const props = defineProps({
  id: String
})

let l = ref(JSON.stringify(props.id))

console.log(props.id, 'arguments')
</script>

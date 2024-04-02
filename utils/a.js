import CA from './a.vue'

export default {
  install: installCA
}

export function installCA (app) {
  app.component('CA', CA)
}
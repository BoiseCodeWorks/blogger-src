import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use(CKEditor);

new Vue({
  router,
  store,
  mounted() {
    if (!localStorage.getItem("baseURL")) {
      store.dispatch('setBaseURL')
    }
  },
  render: function (h) { return h(App) }
}).$mount('#app')

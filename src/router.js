import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Documentation from './views/Documentation.vue'
import Blog from './views/Blog.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: Documentation
    },
    {
      path: '/article/:slug',
      name: 'blog',
      component: Blog
    },
  ]
})

import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import { toast, toastError } from "./swal-config";
import Swal from "sweetalert2";
import slugify from "slugify";
import router from "./router";

Vue.use(Vuex)

const baseURL = localStorage.getItem('baseURL') || '//localhost:3000/api'

let _api = Axios.create({
  baseURL,
  timeout: 5000
})

export default new Vuex.Store({
  state: {
    blogs: [{
      _id: "123",
      title: "What do you do when you don't know what to do",
      slug: "a-slug",
      body: "nothing",
      author: "Jimbo Jones",
      updatedAt: 1562832165111,
      img: "https://assets3.thrillist.com/v1/image/2794471/size/sk-2017_04_standard_listing_desktop.jpg",
      tags: ["javascript", "css", "html"],
      summary: "120 characters max for the summary",
    }],
    blog: {}
  },
  mutations: {
    setBlogs(state, blogs = []) {
      state.blogs = blogs
    },
    setBlog(state, blog = {}) {
      state.blog = blog
    },
    addBlog(state, blog) {
      if (!blog) { return }
      state.blogs.unshift(blog)
    }
  },
  actions: {
    setBaseURL() {
      Swal.fire({
        title: 'Change your server address? ' + baseURL,
        text: "Note: The url will be formatted for you. Just provide the port number.",
        input: 'number',
        inputAutoTrim: true,
        showCancelButton: true,
        inputPlaceholder: 'e.g., 3000',
        preConfirm: port => {
          if (!port) return
          let baseURL = '//localhost:' + port + '/api'
          _api.defaults.baseURL = baseURL
          localStorage.setItem('baseURL', baseURL)
          setTimeout(() => toast({ title: 'Port Updated' }), 100)
        }
      })
    },
    async getBlogs({ commit, state }) {
      try {
        let res = await _api.get("blogs/")
        commit('setBlogs', res.data)
      } catch (err) { toastError(err) }
    },
    async createBlog({ dispatch, commit }) {
      Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2']
      }).queue([
        "What is your name?",
        "What is your blog title?",
      ]).then((result) => {
        if (!result.value) { throw new Error("Blog Creation Canceled") }
        dispatch('sendBlog', result.value)
      }).catch(e => toastError(e))
    },
    async sendBlog({ commit }, val) {
      try {
        let blog = {
          title: val[1],
          author: val[0],
          slug: slugify(val[1], { lower: true })
        }
        let res = await _api.post("blogs", blog)
        if (res.data._id) {
          toast({ title: "Blog Created" })
          commit("addBlog", res.data)
          return true
        }
      } catch (e) { toastError(e) }
    },
    async getBlog({ commit, state }, slug) {
      try {
        if (state.blog.slug == slug) { return }
        let b = state.blogs.find(b => b.slug == slug)
        if (b) { return commit('setBlog', b) }
        let res = await _api.get("blogs/" + slug)
        if (b) { return commit('setBlog', b) }
      } catch (err) { toastError(err) }
    },
    async saveBlog({ dispatch }, blog) {
      try {
        let res = await _api.put("blogs/" + blog._id, blog)
        toast({ title: "Blog Updated" })
        router.push({ name: "blog", params: { slug: blog.slug } })
      } catch (e) { toastError(e) }
    },
    async deleteBlog({ dispatch }, id) {
      try {
        let res = await _api.delete("blogs/" + id)
        toast({ title: "Blog Removed" })
      } catch (e) { toastError(e) }
    },
    async runTests() {

    }
  }
})

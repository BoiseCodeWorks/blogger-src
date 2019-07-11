import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import { toast, toastError } from "./swal-config";
import Swal from "sweetalert2";
import slugify from "slugify";
import router from "./router";

Vue.use(Vuex)

// const baseURL = '/'

const baseURL = localStorage.getItem('baseURL') || '//localhost:3000/api'

let _api = Axios.create({
  baseURL,
  timeout: 5000
})

export default new Vuex.Store({
  state: {
    blogs: [],
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
        let res = await _api.get("blogs?slug=" + slug)
        if (res.data) { return commit('setBlog', res.data) }
      } catch (err) { console.error(err) }
      try {
        let resId = await _api.get("blogs/" + slug)
        if (resId.data) {
          if (resId.data) {
            commit('setBlog', resId.data)
            throw new Error("Had to fetch post by Id instead of slug this is not the intended functionality, Did you forget to create a slug property in your schema")
          }
        }
      } catch (e) { toastError(e) }
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
        dispatch('getBlogs')
      } catch (e) { toastError(e) }
    },
    async runTests() {
      var bdata = {
        title: "__test__blog",
        slug: "__test__blog",
        author: "JIMMY TESTER"
      }
      let blog

      try {
        toast({ title: "Testing Blog Creation", type: "info" })
        let res = await _api.post('blogs', bdata)
        blog = res.data
      } catch (e) {
        return toastError(e)
      }

      try {
        toast({ title: "Testing Blog Edit", type: "info" })
        blog.body = "___THISISATEST___"
        blog.tags = ["___TESTTAG___"]
        let res = await _api.put("blogs/" + blog._id, blog)
      } catch (e) {
        return toastError(e)
      }

      try {
        toast({ title: "Testing Find BlogById", type: "info" })
        let res = await _api.get("blogs/" + blog._id)
        if (!blog.body == res.data.body) {
          throw new Error("Blog FoundById but edit failed")
        }
        blog = res.data
      } catch (e) {
        return toastError(e)
      }

      try {
        toast({ title: "Testing Find Blog by Slug", type: "info" })
        let res = await _api.get("blogs?slug=" + "__test__blog")
        if (!res.data) {
          throw new Error("Unable to find expected test blog by slug __test__blog are you sure your query is correct?")
        }
      } catch (e) {
        return toastError(e)
      }

      try {
        toast({ title: "Testing Find Blogs with Tag", type: "info" })
        let res = await _api.get("blogs?tag=" + "___TESTTAG___")
        if (!Array.isArray(res.data)) {
          throw new Error("Unable to find blogs by tag an array should of returned")
        }
        if (res.data.length < 1) {
          throw new Error("Unable to find expected test blog by tag ___TESTTAG___ are you sure your query is correct?")
        }
      } catch (e) {
        return toastError(e)
      }

      try {
        toast({ title: "Testing Blog Delete", type: "info" })
        _api.delete("blogs/" + blog._id)
      } catch (e) {
        return toastError(e)
      }

      try {
        let res = await _api.get("blogs/" + blog._id)
        if (res.data) {
          throw new Error("Test Blog should of been deleted so subsequent findById should of returned nothing or failed")
        }
      } catch (e) {
        if (e.status == 200) {
          return toastError(e)
        }
      }

      toast({ title: "All tests successfully passed Excellent Job!!!", type: "success" })

    }
  }
})

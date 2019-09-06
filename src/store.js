import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import { toast, toastError } from "./swal-config";
import Swal from "sweetalert2";
import slugify from "slugify";
import router from "./router";

Vue.use(Vuex)

const baseURL = '/'

// const baseURL = '//localhost:3000'
let _auth = Axios.create({
  baseURL: baseURL + "/account",
  timeout: 5000,
  withCredentials: true
})

let _api = Axios.create({
  baseURL: baseURL + '/api',
  timeout: 5000,
  withCredentials: true
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
    async getBlog({ commit, state }, id) {
      try {
        let resId = await _api.get("blogs/" + id)
        if (resId.data) {
          if (resId.data) {
            commit('setBlog', resId.data)
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
        summary: "__a__test__summary",
        img: "https://bcw.blob.core.windows.net/public/images/7611997462992308",
        body: "__MYBODY__",
        slug: Math.random()
      }
      var userData = {
        email: "__JIMMYTESTER@testerdata.com",
        name: "JIMMY TESTER",
        password: "Testing123!"
      }
      var badUser = {
        email: "__BADJIMMYTESTER__@badtesterdata.com",
        name: "BAD JIMMY TESTER",
        password: "Testing123!"
      }
      let blogs
      let blog
      let authData


      try {
        toast({ title: "Testing no auth requirements", type: "info" })
        let res = await _api.get("blogs")
        blogs = res.data
        if (!Array.isArray(blogs)) {
          throw new Error("Unable to get blogs when not logged in or bad data retrived when requesting blogs")
        }
      } catch (e) { return toastError(e) }



      toast({
        title: "Attempting to login",
        type: "info"
      })

      //AUTH
      try {
        if (!localStorage.getItem("BLOGGER__BADREGISTERED")) {
          await _auth.post("register", badUser)
          localStorage.setItem("BLOGGER__BADREGISTERED", "true")
        }
      } catch (e) {
        localStorage.setItem("BLOGGER__BADREGISTERED", "true")
      }
      try {
        await _auth.delete("logout")
      } catch (e) { }
      try {
        let res = await _auth.get("authenticate")
        if (res.data) { authData = res.data }
      } catch (e) {
        authData = null
      }

      if (!authData) {
        try {
          let res = await _auth.post("login", userData)
          if (res.data) { authData = res.data }
        } catch (e) {
          authData = null
        }
      }
      if (!authData) {
        try {
          let res = await _auth.post("register", userData)
          if (!res.data) { authData = res.data }
        } catch (e) {
          return toastError({
            ...e,
            response: {
              data: "Auth System is broken please seek assistance"
            }
          })
        }
      }



      toast({
        title: "Successfully logged in",
        type: "success"
      })



      try {
        toast({ title: "Testing Blog Creation", type: "info" })
        let res = await _api.post('blogs', bdata)
        blog = res.data
      } catch (e) { return toastError(e) }

      try {
        let res = await _api.get("blogs/" + blog._id)
        blog = res.data
        if (!blog) { throw new Error("Unable to retrive blog by its id") }
        if (!blog.author) { throw new Error("Author was not attached when blog was created") }
        if (blog.author.name != authData.name) { throw new Error("Blog author was not set or not populated when requesting blog by its id") }
      } catch (e) { return toastError(e) }

      try {
        toast({ title: "Testing Blog Edit", type: "info" })
        blog.body = "___THISISATEST___"
        // blog.tags = ["___TESTTAG___"]
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
        toast({ title: "Testing Auth Checks for edit and delete", type: "info" })
        let logoutRes = await _auth.delete("logout")
        let badUserRes = await _auth.post("login", badUser)
      } catch (e) {
        return toastError(e)
      }

      try {
        blog.body = "___THISSHOULDFAIL___"
        let updateblogres = await _api.put("blogs/" + blog._id, blog)
        let res = await _api.get("blogs/" + blog._id)
        if (blog.body == res.data.body) {
          return toast({ title: "Blog Edit is not limited to the creator", type: "error", timer: 15000 })
        }
      } catch (e) {
        blog.badupdate = "failed"
      }

      if (!blog.badupdate) { return toast({ title: "Edit not limited to creator for blog", type: "error", timer: 15000 }) }

      try {
        let delteblogres = await _api.delete("blogs/" + blog._id)
        let res = await _api.get("blogs/" + blog._id)
        if (!res.data) {
          return toast({ title: "Blog Delete is not limited to the creator", type: "error", timer: 15000 })
        }
      } catch (e) {
        blog.deleted = "failed"
      }

      if (!blog.deleted) {
        return toast({ title: "Delete not limited to creator for blog", type: "error", timer: 15000 })
      }

      try {
        await _auth.post("login", userData)
      } catch (e) {
        return toastError(e)
      }

      try {
        toast({ title: "Testing Blog Delete", type: "info" })
        await _api.delete("blogs/" + blog._id)
      } catch (e) {
        return toastError(e)
      }

      try {
        let res = await _api.get("blogs/" + blog._id)
        if (res.data) {
          return toast({ title: "Test Blog should of been deleted so subsequent findById should of returned nothing or failed", type: "error", timer: 15000 })
        }
      } catch (e) { }

      toast({ title: "Testing Comments", type: "info" })
      let nblog
      let comment1
      try {
        bdata.body = "__TEST__BLOG__WITH__COMMENTS__"
        let bres = await _api.post('blogs', bdata)
        nblog = bres.data
        let cres = await _api.post("comments", {
          body: "THIS__COMMENT__IS__GREAT",
          blogId: nblog._id
        })
        comment1 = cres.data

        let commentEditRes = await _api.put("comments/" + comment1._id, { body: "I__CAN__EDIT__MY__COMMENT" })
        if (commentEditRes.data.body != "I__CAN__EDIT__MY__COMMENT") {
          throw new Error("Unable to edit comment")
        }
      } catch (e) {
        toastError(e)
      }

      try {
        await _auth.delete("logout")
        await _auth.post("login", badUser)
        let cres2 = await _api.post("comments", {
          body: "THIS__COMMENT__IS__GREAT__AS__WELL",
          blogId: nblog._id
        })
        let comment2 = cres2.data
        let commentEditRes = await _api.put("comments/" + comment1._id, { body: "I__CAN__EDIT__MY__COMMENT" })
      } catch (e) {
        comment1.edit = "failed"
      }

      try {
        if (comment1.edit != 'failed') {
          throw new Error("Comment Edits not locked to author")
        }
      } catch (e) {
        return toastError(e)
      }

      try {
        let res = await _api.get("blogs/" + nblog._id + "/comments")
        let comments = res.data
        if (!Array.isArray(comments) || comments.length != 2) {
          throw new Error("Comments not returned when requesting blogs/:id/comments")
        }
        if (!comments[0].author.name) {
          throw new Error("Comment authors are not populated")
        }
      } catch (e) {
        return toastError(e)
      }

      toast({ title: "All tests successfully passed Excellent Job!!!", type: "success" })

    }
  }
})

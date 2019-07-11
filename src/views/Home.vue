<template>
  <div class="home row justify-content-center">
    <div class="col-11">
      <form>
        <div class="d-flex align-items-center">
          <i class="action muted fa fa-fw fa-times" v-if="query.length" @click="query = ''"></i>
          <input
            autofocus
            placeholder="search..."
            required
            class="__query w-100"
            name="query"
            type="text"
            v-model="query"
          />
        </div>
      </form>
      <div v-if="results.length" class="row">
        <blog-card v-for="blog in results" :key="blog._id" :blog="blog" @setQuery="setQuery" />
      </div>
    </div>
    <div class="__fab">
      <input type="checkbox" name="__fab_toggle" class="__fab_toggle" />
      <div class="__fab_button action">
        <i class="fa fa-cog"></i>
      </div>
      <div class="__fab_buttons">
        <a
          class="text-white action d-flex align-items-center justify-content-center"
          title="Add Blog"
          @click="createBlog"
        >
          <i class="fa fa-plus-circle"></i>
        </a>
        <a
          class="text-white action d-flex align-items-center justify-content-center"
          title="Set Port"
          @click="setBaseUrl"
        >
          <i class="fa fa-plug"></i>
        </a>
        <a
          class="text-white action d-flex align-items-center justify-content-center"
          title="Run Tests"
        >
          <i class="fa fa-clipboard"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import BlogCard from "@/components/BlogCard.vue";
export default {
  name: "home",
  data() {
    return {
      query: ""
    };
  },
  mounted() {
    this.$store.dispatch("getBlogs");
  },
  computed: {
    blogs() {
      return this.$store.state.blogs;
    },
    results() {
      if (!this.query.length) {
        return this.blogs;
      }
      let reg = new RegExp(this.query, "ig");
      return this.blogs.filter(b => {
        if (reg.test(b.title)) {
          return true;
        }
        return b.tags.includes(this.query);
      });
    }
  },
  methods: {
    setQuery(query) {
      this.query = query;
    },
    createBlog() {
      this.$store.dispatch("createBlog");
    },
    setBaseUrl() {
      this.$store.dispatch("setBaseURL");
    }
  },
  components: { Navigation, BlogCard }
};
</script>

<style>
.__query,
.__query:active,
.__query:focus {
  margin-left: 5px;
  margin-bottom: 5px;
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
  border-bottom: 1px solid var(--main);
  color: var(--main);
  font-size: x-large;
}
.__query:active,
.__query:focus {
  border-bottom-width: 2px;
}
.__query::placeholder {
  color: var(--main);
  font-size: x-large;
}

.__fab {
  position: fixed;
  bottom: 35px;
  right: 35px;
}

.__fab_button {
  height: 60px;
  width: 60px;
  background-color: var(--secondary);
  border-radius: 50%;
  display: block;
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.__fab_button:hover {
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
}

.__fab_button:hover i {
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
}

.__fab_button i {
  font-size: 22px;
}

.__fab_buttons {
  position: absolute;
  width: 100%;
  bottom: 120%;
  text-align: center;
}

.__fab_buttons a {
  background-color: #302e2e;
  display: block;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  text-decoration: none;
  margin: 10px auto 0;
  line-height: 1.15;
  color: #fff;
  opacity: 0;
  visibility: hidden;
  position: relative;
  box-shadow: 0 0 5px 1px rgba(51, 51, 51, 0.3);
}

.__fab_buttons a:hover {
  transform: scale(1.05);
}

.__fab_buttons a:nth-child(1) {
  transition: all 0.05s ease-in-out;
}
.__fab_buttons a:nth-child(2) {
  transition: all 0.15s ease-in-out;
}
.__fab_buttons a:nth-child(3) {
  transition: all 0.25s ease-in-out;
}

.adminActions a i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.__fab_toggle {
  -webkit-appearance: none;
  position: absolute;
  border-radius: 50%;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  z-index: 2;
  transition: box-shadow 0.2s ease-in-out;
  box-shadow: 0 3px 5px 1px rgba(51, 51, 51, 0.3);
}

.__fab_toggle:hover {
  box-shadow: 0 3px 6px 2px rgba(51, 51, 51, 0.3);
}

.__fab_toggle:checked ~ .__fab_buttons a {
  opacity: 1;
  visibility: visible;
}
</style>

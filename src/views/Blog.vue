<template>
  <div class>
    <blog-card :blog="blog" :full="true" v-if="!editing" />
    <div class="card p-3" v-if="editing">
      <form @submit="save">
        <div class="form-group d-flex align-items-center">
          <input type="file" @change="addImage()" />
          <br />
          <img :src="blog.img" height="200" alt="Image preview..." />
        </div>
        <div class="form-group">
          <label for="slug">Slug:</label>
          <input class="disabled muted form-control" v-model="slug" readonly />
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Title:</label>
          <div class="d-flex align-items-center">
            <input
              class="form-control"
              type="text"
              placeholder="title"
              v-model.trim="blog.title"
              maxlength="60"
            />
            <small class="ml-1">
              <small>{{blog.title.length}}/60</small>
            </small>
          </div>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Summary:</label>
          <div class="d-flex align-items-center">
            <input
              class="form-control"
              type="text"
              placeholder="title"
              v-model.trim="blog.summary"
              maxlength="120"
            />
            <small class="ml-1">
              <small>{{blog.summary.length}}/120</small>
            </small>
          </div>
        </div>
        <div class="form-group">
          <label for="body"></label>
          <div class="outline" contenteditable="true" v-html="blog.body" @blur="setBody" />
        </div>
        <div class="form-group">
          <div class="blog-tags">
            <ul>
              <li v-for="(tag, i) in blog.tags" :key="tag">
                <a class="action" @click="removeTag(i)">{{tag}}</a>
              </li>
              <li>
                <a class="action" @click="addTag">
                  <i class="fa fa-fw fa-plus"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
    <div class="__fab">
      <input type="checkbox" name="__fab_toggle" class="__fab_toggle" />
      <div class="__fab_button action">
        <i class="fa fa-cog"></i>
      </div>
      <div class="__fab_buttons">
        <a
          class="text-white action d-flex align-items-center justify-content-center"
          title="Edit"
          v-if="!editing"
          @click="editing = true"
        >
          <i class="fa fa-pen"></i>
        </a>
        <a
          class="text-white action d-flex align-items-center justify-content-center bg-success"
          title="Set Port"
          v-if="editing"
          @click="save"
        >
          <i class="fa fa-upload"></i>
        </a>
        <a
          class="text-white action d-flex align-items-center justify-content-center bg-danger"
          title="Set Port"
          @click="deleteBlog"
        >
          <i class="fa fa-trash"></i>
        </a>
      </div>
    </div>
  </div>
</template>


<script>
import BlogCard from "../components/BlogCard";
import Swal from "sweetalert2";
import slugify from "slugify";
export default {
  name: "Blog",
  data() {
    return {
      editing: true
    };
  },
  mounted() {
    this.$store.dispatch("getBlog", this.$route.params.slug);
  },
  computed: {
    blog() {
      return this.$store.state.blog;
    },
    slug() {
      return slugify(this.blog.title, { lower: true });
    }
  },
  methods: {
    addImage() {
      event.target.files;
      var file = event.target.files[0];
      var reader = new FileReader();

      reader.addEventListener(
        "load",
        _ => {
          this.blog.img = reader.result;
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    setBody() {
      this.blog.body = event.target.innerHTML;
    },
    save() {
      this.blog.slug = this.slug;
      this.$store.dispatch("saveBlog", this.blog);
      this.editing = false;
    },
    deleteBlog() {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          this.$store.dispatch("deleteBlog", this.blog._id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          this.$router.push({ name: "home" });
        }
      });
    },
    removeTag(i) {
      this.blog.tags.splice(i, 1);
    },
    addTag() {
      Swal.fire({
        title: "Add Tag",
        input: "text",
        inputAutoTrim: true,
        showCancelButton: true,
        inputPlaceholder: "tag",
        preConfirm: tag => {
          if (!tag) {
            return;
          }
          let found = this.blog.tags.find(t => t == tag);
          if (found) {
            return;
          }
          this.blog.tags.push(tag);
        }
      });
    }
  },
  components: { BlogCard }
};
</script>

<style>
.blog-body b {
  font-weight: bold;
}
.outline {
  padding: 1em;
  border: 1px solid #ced4da;
  border-radius: 3px;
}
</style>
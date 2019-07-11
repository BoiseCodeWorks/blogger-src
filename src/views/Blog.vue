<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>


<script>
export default {
  name: "Blog",
  mounted() {
    this.$store.dispatch("getBlog", this.$route.params.slug);
  },
  computed: {
    blog() {
      return this.$store.state.blog;
    }
  }
};
</script>
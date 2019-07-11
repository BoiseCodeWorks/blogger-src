<template>
  <div class="blog-container">
    <div class="blog-header">
      <div class="blog-cover" :style="{'background-image': `url(${blog.img})`}">
        <div class="blog-author">
          <h3>{{blog.author}}</h3>
        </div>
      </div>
    </div>

    <div class="blog-body">
      <div class="blog-title">
        <h1>
          <router-link :to="{name: 'blog', params:{slug: blog.slug}}">{{blog.title}}</router-link>
        </h1>
      </div>
      <div class="blog-summary">
        <p>{{blog.summary}}</p>
      </div>
      <div class="blog-tags">
        <ul>
          <li v-for="tag in blog.tags" :key="tag">
            <a class="action" @click="$emit('setQuery',tag)">{{tag}}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="blog-footer">
      <ul>
        <li v-if="blog.created" class="published-date">{{blog.created | timeago}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogCard",
  props: {
    blog: {
      type: Object,
      required: true
    }
  },
  filters: {
    timeago(val) {
      try {
        let d = new Date(val);
        return `${d.toLocaleString()}`;
      } catch (e) {
        return "";
      }
    }
  }
};
</script>

<style>
body {
  background: #e5ded8;
  box-sizing: border-box;
}

.blog-container {
  background: #fff;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 4px 2px -2px;
  font-family: "Roboto", sans-serif;
  font-weight: 100;
  margin: 48px auto;
}
@media screen and (min-width: 480px) {
  .blog-container {
    width: 28rem;
  }
}
@media screen and (min-width: 767px) {
  .blog-container {
    width: 40rem;
  }
}
@media screen and (min-width: 959px) {
  .blog-container {
    width: 50rem;
  }
}

.blog-container a {
  color: var(--main);
  text-decoration: none;
  transition: 0.25s ease;
}
.blog-container a:hover {
  color: var(--secondary);
}

.blog-cover {
  background: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/17779/yosemite-3.jpg")
    center no-repeat;
  background-size: cover;
  border-radius: 5px 5px 0 0;
  height: 15rem;
  box-shadow: inset rgba(0, 0, 0, 0.2) 0 64px 64px 16px;
}

.blog-author,
.blog-author--no-cover {
  margin: 0 auto;
  padding-top: 0.125rem;
  width: 80%;
  text-shadow: 2px 2px black;
}

.blog-author h3::before,
.blog-author--no-cover h3::before {
  background: url("../assets/blogger-logo.png");
  background-size: cover;
  border-radius: 50%;
  content: " ";
  display: inline-block;
  height: 32px;
  margin-right: 0.5rem;
  position: relative;
  top: 8px;
  width: 32px;
  background-color: #302e2e;
}

.blog-author h3 {
  color: #fff;
  font-weight: 100;
}

.blog-author--no-cover h3 {
  color: #999999;
  font-weight: 100;
}

.blog-body {
  margin: 0 auto;
  width: 80%;
}

.video-body {
  height: 100%;
  width: 100%;
}

.blog-title h1 a {
  color: #333;
  font-weight: 100;
}

.blog-summary p {
  color: #4d4d4d;
}

.blog-tags ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  padding-left: 0;
}

.blog-tags li + li {
  margin-left: 0.5rem;
}


.blog-tags a {
  border: 1px solid #999999;
  border-radius: 3px;
  color: #999999;
  font-size: 0.75rem;
  height: 1.5rem;
  line-height: 1.5rem;
  letter-spacing: 1px;
  padding: 0 0.5rem;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  width: 5rem;
}

.blog-tags li a:hover{
  border-color: #fff;
  background-color: var(--secondary);
  color: #fff !important;
}


.blog-footer {
  border-top: 1px solid #e6e6e6;
  margin: 0 auto;
  padding-bottom: 0.125rem;
  padding-top: 0.25rem;
  width: 80%;
}

.blog-footer ul {
  list-style: none;
  display: flex;
  flex: row wrap;
  justify-content: flex-end;
  padding-left: 0;
}

.blog-footer li:first-child {
  margin-right: auto;
}

.blog-footer li + li {
  margin-left: 0.5rem;
}

.blog-footer li {
  color: #999999;
  font-size: 0.75rem;
  height: 1.5rem;
  letter-spacing: 1px;
  line-height: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  white-space: nowrap;
}
.blog-footer li a {
  color: #999999;
}

.published-date {
  border: 1px solid #999999;
  border-radius: 3px;
  padding: 0 0.5rem;
}

.numero {
  position: relative;
  top: -0.5rem;
}
</style>
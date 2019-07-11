<template>
  <div id="app">
    <navigation />
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
export default {
  name: "App",
  components: { Navigation }
};
</script>

<style>
:root {
  --main: #44494d;
  --secondary: #03a9f4;
}
.color {
  color: var(--main);
}
.bg {
  background: var(--main);
}
.action {
  cursor: pointer;
  transition: all .15s linear;
}
.muted{
  opacity: .85;
}
.action:hover .muted, .action:hover.muted{
  opacity: 1;
}
.no-events {
  pointer-events: none;
}
.ts-white {
  text-shadow: 10px 2px white, -10px -2px white;
}
.w-fc {
  width: fit-content;
}
</style>

<template>
    <div class="navigation w-100 mb-4">
      <div class="col d-flex justify-content-between align-items-center">
          <div class="action muted m-1" @click="$router.push({name: 'home'})">
              <img src="../assets/blogger-logo.png" alt="logo" height="100">
          </div>
          <h1 v-if="title" data-toggle="toggle" data-placement="top" title="Back to Home" class="action nav-title">Blogger</h1>
      </div>
   </div>
</template>

<script>
import Swal from 'sweetalert2'
export default {
   name: "navigation",
   data() {
      return {
          open: false,
          links: [{name: "Home", routeName: "home", class: ''}, 
                  {name: "Playlists", routeName: "playlists", class: ''},
                  {name: "Documentation", routeName: "documentation", class: " order-1"}]
      }
   },
   computed: {
       title(){
           return this.$route.name
       },
       baseURL() {
           return this.$store.state.baseURL || '//localhost:3000/api'
       }
   },
   methods: {
       setBaseURL() {
           Swal.fire({
               title: 'Change your server address?',
               text: "Note: The url will be formatted for you. Just provide the port number.",
               input: 'number',
               inputAutoTrim: true,
               showCancelButton: true,
               inputPlaceholder: 'e.g., 3000',
               preConfirm: port => {
                   if(!port) return
                   this.$store.dispatch('setBaseURL', port)
                   setTimeout(() => this.$store.dispatch('cstmAlrt', {method: 'toast', title: 'Port Updated'}), 100)
               }
           })
       }
   },
   components: {}
}
</script>

<style>
.navigation {
   box-shadow: 0 -2px 10px 1px black;
   background: url(../assets/banner.png) no-repeat; 
}
.nav-title {
   color: var(--light);
   text-shadow: 5px 5px black;
   font-family: "Roboto"
}
.nav-img {
   height: 35px;
   width: 35px;
   border-radius: 50%;
}
.side-nav-btn {
    position: absolute;
    right: 1vw;
    top: 1.5vh;
    z-index: 2;
}
.side-nav {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1;
    box-shadow: 0 0 100px 10px black;
    padding-top: 20vh;
    height: 100vh;
}
</style>

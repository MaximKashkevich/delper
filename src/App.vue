<template>
  <div class="app">
    <router-view />

  </div>
</template>
<script>
// import axios from 'axios';

export default {
  name: 'App',
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  created: function () {

    // axios.interceptors.response.use(undefined, function (err) {
    // return new Promise(function () {
    // if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
    // // if you ever get an unauthorized, logout the user
    // this.$store.dispatch('AUTH_LOGOUT');
    // // you can also redirect to /login if needed !
    // }
    // throw err;
    // });
    // });
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth
      this.$store.commit('ui/SET_WINDOW_WIDTH', this.windowWidth)
    },
  },
}
</script>
<style lang="scss">
//.app {
//  background-color: var(--color-gray-light);


//}</style>

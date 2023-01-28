<template>
  <v-app-bar app color="blue lighten-5" dark elevation="1">
    <router-link class="text-decoration-none" to="/home">
      <div class="d-flex align-center justify-center">
        <v-img alt="Inab Logo" class="shrink mr-2" contain :src="logo" transition="scale-transition" width="40" />

        <div class="text-h4 font-weight-medium black--text">INAB Admin Library</div>
      </div>
    </router-link>

    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
import logo from '@/assets/inab.png'

export default {
  name: 'Appbar',
  data() {
    return {
      logo: logo
    }
  }
}
</script>

<style>

</style>
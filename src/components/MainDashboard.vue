<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card >
          <v-card-title>
            Welcome, admin
          </v-card-title>
          <v-card-subtitle>
            Admin Dashboard
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed } from 'vue';
import router from '@/router';

export default {
  name: 'HelloWorld',
  // data() {
  //   return {
  //     user: null,
  //   };
  // },
  // created() {
  //   auth.onAuthStateChanged((user) => {
  //     this.$store.dispatch("fetchUser", user);
  //   });

  //   this.user = computed(() => {
  //     return this.$store.getters.user;
  //   });

  //   console.log(this.user.loggedIn)
  // },
  // mounted() {
  //   console.log(this.user.loggedIn)
  // },
  // methods: {
  //   signOut() {
  //     this.$store.dispatch('logOut')
  //     router.push('/login')
  //   }
  // }
}
</script>

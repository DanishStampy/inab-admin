<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="6" class="mx-auto">
        <v-card outlined elevation="2" class="pa-7 rounded-lg">
          <v-card-title>Login</v-card-title>
          <v-card-subtitle>Welcome back!</v-card-subtitle>
          <v-form action="#" @submit.prevent="logIn" lazy-validation class="px-3">

            <v-text-field type="email" v-model="email" label="E-mail" required></v-text-field>

            <v-text-field type="password" v-model="password" label="Password" required></v-text-field>

            <v-btn v-if="!xhrRequest" type="submit" color="success" class="mr-4">
              Login
            </v-btn>
            <v-btn v-if="xhrRequest" disabled depressed>
              <v-progress-circular color="grey" indeterminate :size="20">
              </v-progress-circular>
            </v-btn>
            <p>{{ error }}</p>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      error: null,
      xhrRequest: false
    }
  },

  created() {
    // firebase.auth().onAuthStateChanged((user) => {
    //   if(!user) {
    //     console.log("no user")
    //   } else {
    //     this.$router.push('/home')
    //     console.log("user !")
    //   }
    // })
  },

  methods: {
    logIn() {

      this.xhrRequest = !this.xhrRequest

      // set auth to local
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {

          // sign in
          firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              (user) => {
                console.log(user)
                this.$router.push("/home")
              },
              (err) => {
                this.xhrRequest = !this.xhrRequest
                this.error = err
              })
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style>

</style>

<template>
  <v-app>
    <AppbarVue />
    <SidebarVue :user="user" />
    <v-container>
      <router-view/>
    </v-container>
  </v-app>
</template>

<script>
import SidebarVue from '@/components/Sidebar';
import AppbarVue from '@/components/Appbar.vue';
import MainDashboard from '@/components/MainDashboard'
import firebase from 'firebase';

export default {
  name: 'Home',
  data(){
    return {
      user: {
        id: '',
        initial: '',
        fullName: '',
        email: ''
      }
    }
  },
  components: {
    MainDashboard,
    SidebarVue,
    AppbarVue
  },

  created() {

    firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        this.user.id = firebase.auth().currentUser.uid
        this.user.fullName = doc.data().fullName
        this.user.email = doc.data().email
        this.user.initial = this.user.fullName.split(" ").reduce((acc, cur) => acc + cur.charAt(0), "").trim()
      })
      .catch(error => console.log(error))
  }
}
</script>

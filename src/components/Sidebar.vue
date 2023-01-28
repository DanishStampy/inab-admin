<template>
  <v-navigation-drawer permanent app class="blue lighten-5">
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-avatar
            color="#0277BD"
            size="40"
            class="white--text"
          >
          {{ user.initial }}
          </v-avatar>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item transition="fade-transition" link>
        <router-link class="text-decoration-none" to="/profile">
          <v-list-item-content>
            <!-- <v-progress-linear indeterminate color="blue lighten-1"></v-progress-linear> -->
            <div>
              <v-list-item-title class="text-h6 black--text">
                {{ user.fullName }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </div>
          </v-list-item-content>
        </router-link>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-for="item in items" :key="item.path" nav dense>
      <router-link class="text-decoration-none" :to="item.path">
        <v-list-item link active-class="highlighted" :class="item.path === $route.path ? 'highlighted' : ''">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="black--text">
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>
      </router-link>
    </v-list>

    <template v-slot:append>
      <div class="pa-2 pb-4">
        <v-btn block color="red" class="white--text" @click="logOut">
          Logout
          <v-icon right>
            mdi-logout-variant
          </v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import Avatar from "@/assets/people_icon.png"
import { computed } from 'vue'
import firebase from 'firebase';

export default {
  name: 'Sidebar',
  data() {
    return {
      loading: true
    }
  },
  props: {
    user: Object
  },
  data() {
    return {
      avatar: Avatar,
      items: [
        {
          icon: "mdi-book-open-variant",
          path: "/book",
          text: "List of Books"
        },
        {
          icon: "mdi-text-box",
          path: "/request",
          text: "Request List"
        },
        {
          icon: "mdi-post",
          path: "/log",
          text: "Book Log"
        },
        {
          icon: "mdi-account",
          path: "/profile",
          text: "Profile"
        },
        
      ]
    }
  },
  created() {
    this.loading = true
    console.log(this.user)
    
  },

  methods: {
    logOut() {

      firebase.auth().signOut()
        .then(() => {
          // successfully sign out
          // clear out the local
          firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
            .then(() => {
              this.$router.push("/login")
            })
            .catch((err) => console.log(err))
        });
    },
  },
}
</script>

<style>

</style>
import { auth } from '@/firebaseConfig'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },
  actions: {

    // login
    async logIn (context, {email, password}) {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        context.commit('SET_USER', response.user)
      } else {
        throw new Error('login failed')
      }
    },

    // logout
    async logOut(context) {
      await signOut(auth)
      context.commit('SET_USER', null)
    },

    // user data (logged)
    async fetchUser(context, user) {
      context.commit("SET_LOGGED_IN", user !== null);
      if (user) {
        context.commit("SET_USER", {
          email: user.email,
          id: user.uid
        })
      } else {
        context.commit("SET_USER", null)
      }
    }

  },
  modules: {
  }
})

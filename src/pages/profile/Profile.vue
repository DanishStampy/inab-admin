<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="6">
        <v-card :loading="loading" >
          <template slot="progress">
              <v-progress-linear color="blue" height="5" indeterminate></v-progress-linear>
            </template>
          <v-row class="pa-5">
            <v-col class="d-flex justify-center align-center my-3" cols="4">
              <v-avatar size="100" color="#0277BD" class="white--text text-h4">
                {{ user.initial }}
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-row class="my-auto">
                <v-col cols="12">
                  <span class="font-weight-bold">Full Name:</span> {{ user.fullName }}
                </v-col>
                <v-col cols="12">
                  <span class="font-weight-bold">Email Address:</span> {{ user.email }}
                </v-col>
                <v-col cols="12">
                  <span class="font-weight-bold">Phone Number:</span> {{ user.phoneNum }}
                </v-col>
                <v-col cols="12">
                  <span class="font-weight-bold">School Name:</span> {{ user.school }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="mx-3 my-4"></v-divider>
          <v-card-actions>
            <v-row class="ml-4 my-3">
              <v-btn class="mr-3" :class="[editCard ? 'warning' : 'primary']" :disabled="editOpen" @click="revealCardProfile">{{
    btnEditState
}}</v-btn>
              <v-btn :class="[editPassword ? 'warning' : 'error']" :disabled="changeOpen" @click="revealCardPassword">{{ btnChangeState
}}</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


    <v-row class="justify-center">
      <v-col cols="6">
        <v-expand-transition>
          <!-- Edit Card -->
          <v-card  class="pa-5" v-show="editCard">
            <v-card-title>Edit Profile</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field required v-model="user.fullName" label="Full Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field required v-model="user.email" label="Email Address"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field required v-model="user.phoneNum" label="Phone Number"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field required v-model="user.school" label="School Name"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="!xhrRequest" color="success" class="" @click="saveEdit">Save</v-btn>
              <v-btn v-if="xhrRequest" disabled depressed>
                <v-progress-circular color="grey" indeterminate :size="20">
                </v-progress-circular>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
        <v-expand-transition>
          <!-- Change Password Card -->
          <v-card class="pa-5" v-show="editPassword">
            <v-card-title>Change Password</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field required v-model="emailPassword" label="Email Address"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="!xhrRequest" color="success" class="" @click="submitEmailPassword">Submit</v-btn>
              <v-btn v-if="xhrRequest" disabled depressed>
                <v-progress-circular color="grey" indeterminate :size="20">
                </v-progress-circular>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase'

export default {
  data() {
    return {
      editOpen: false,
      changeOpen: false, 
      loading: true,
      xhrRequest: false,
      user: {
        'id': '',
        'fullName': '',
        'email': '',
        'school': '',
        'phoneNum': '',
        'initial': '',
      },
      emailPassword: '',
      editCard: false,
      editPassword: false,
      btnEditState: "Edit",
      btnChangeState: "Change Password"
    }
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
        this.user.school = doc.data().school
        this.user.phoneNum = doc.data().phoneNum
        this.user.initial = this.user.fullName.split(" ").reduce((acc, cur) => acc + cur.charAt(0), "").trim()
        this.loading = false
      })
      .catch(error => {

        console.log(error)
      })
  },

  methods: {
    revealCardProfile() {
      this.editCard = !this.editCard
      this.changeOpen = !this.changeOpen
      this.btnEditState = this.editCard ? "Close" : "Edit"
    },

    revealCardPassword() {
      this.editPassword = !this.editPassword
      this.editOpen = !this.editOpen
      this.btnChangeState = this.editPassword ? "Close" : "Change Password"
    },

    saveEdit() {
      this.xhrRequest = !this.xhrRequest

      const user = firebase.auth().currentUser;
      user.updateEmail(this.user.email)
        .then(() => {
          console.log("update email success")
        })
        .catch(error => console.log(error))

      firebase.firestore()
        .collection("users")
        .doc(this.user.id)
        .update(this.user)
        .then(() => {
          console.log("update admin")
          this.revealCardProfile();
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
          this.xhrRequest = !this.xhrRequest
        })
    },

    submitEmailPassword() {
      this.xhrRequest = !this.xhrRequest
      
      firebase.auth()
        .sendPasswordResetEmail(this.emailPassword)
        .then(() => {
          console.log("email submitted!")
          this.revealCardPassword()
        })
        .catch(error => {
          console.log(error)
          this.xhrRequest = !this.xhrRequest
        })
    }
  }
}
</script>

<style>

</style>
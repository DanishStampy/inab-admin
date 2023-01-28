<template>
  <div>
    <v-alert border="left" type="success" :value="isSuccess" elevation="4" transition="scroll-x-transition">{{
        successMsg
    }}</v-alert>

    <v-data-table :headers="headers" :items="filteredRequest" :loading="request.length < 1"  :search="search"
      loading-text="Fetching request..." sort-by="id" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat class="blue lighten-5">
          <v-toolbar-title class="font-weight-bold">Borrow Request</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
              <v-card-title class="text-h6">
                Update request status
              </v-card-title>
              <v-card-text>
                {{ dialogMsg }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">
                  Cancel
                </v-btn>
                <v-btn color="green darken-1" text @click="save">
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>

        <!-- FILTER SECTION -->
        <template>
          <v-expansion-panels :disabled="request.length < 1" flat class="mb-4">
            <v-expansion-panel expand accordion>
              <v-expansion-panel-header class='pa-4 blue lighten-5'>
                <span class="font-weight-bold">Filter</span>
              </v-expansion-panel-header>
              <!-- FILTER CONTENT -->
              <v-expansion-panel-content>
                <!-- Quick Search -->
                <div class="mx-4 mb-6">
                  <v-text-field class="mt-0" v-model="search" append-icon="mdi-magnify" label="Quick Search" single-line
                    hide-details></v-text-field>
                </div>

                <!-- Status -->
                <v-row class="mx-4">
                  <v-col cols="6">
                    <div class="font-weight-bold">Status:</div>
                    <v-row class="ml-1 mt-1">
                      <v-checkbox class="mt-0 mr-4" v-model="filter.pending">
                        <template v-slot:label>
                          Pending
                        </template>
                      </v-checkbox>
                      <v-checkbox class="mt-0 mr-4" v-model="filter.approved">
                        <template v-slot:label>
                          Approved
                        </template>
                      </v-checkbox>
                      <v-checkbox class="mt-0 mr-4" v-model="filter.rejected">
                        <template v-slot:label>
                          Rejected
                        </template>
                      </v-checkbox>
                      <v-checkbox class="mt-0 mr-4" v-model="filter.returned">
                        <template v-slot:label>
                          Returned
                        </template>
                      </v-checkbox>
                    </v-row>
                  </v-col>

                  <!-- Student Name -->
                  <v-col cols="6">
                    <div class="font-weight-bold">Student Name:</div>
                    <v-select v-model="filter.student" class="mt-1 pt-0" :items="student" label=""></v-select>
                  </v-col>

                </v-row>
              </v-expansion-panel-content>
              <v-divider class="mx-0"></v-divider>
            </v-expansion-panel>
          </v-expansion-panels>

        </template>

      </template>
      <template v-slot:item.actions="{ item }">
        <div v-if="item['status_request'] === 'Returned'">
          <div>-</div>
        </div>
        <div v-else-if="item['status_request'] === 'Approved'">
          <v-icon color="red" @click="rejectDialog(item)">
            mdi-close-box
          </v-icon>
        </div>
        <div v-else-if="item['status_request'] === 'Rejected'">
          <v-icon class="mr-2" color="green" @click="acceptDialog(item)">
            mdi-checkbox-marked
          </v-icon>
        </div>
        <div v-else>
          <v-icon class="mr-2" color="green" @click="acceptDialog(item)">
            mdi-checkbox-marked
          </v-icon>
          <v-icon color="red" @click="rejectDialog(item)">
            mdi-close-box
          </v-icon>
        </div>
      </template>
      <template v-slot:no-data>
       <p>No borrow request data yet.</p>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      isSuccess: false,
      successMsg: '',
      filterPanel: [[true]],
      dialogMsg: '',
      dialog: false,
      dialogDelete: false,
      dialogStatus: null,
      search: '',
      headers: [
        {
          text: 'Student Name',
          align: 'start',
          sortable: false,
          value: 'student_name',
        },
        { text: 'Book Title', value: 'book_name' },
        { text: 'Request Date', value: 'request_date' },
        { text: 'Return Date', value: 'return_date' },
        { text: 'Status', value: 'status_request' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      request: [],
      student: [],
      currentRequest: {
        'id': '',
        'book_id': '',
        'book_name': '',
        'request_date': '',
        'return_date': '',
        'status_request': '',
        'student_id': '',
        'student_name': '',
      },
      currentRequestIndex: '',
      filter: {
        student: '',
        pending: false,
        approved: false,
        rejected: false,
        returned: false,
      }
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  computed: {
    filteredRequest() {
      if (!this.filter.pending && !this.filter.approved && !this.filter.rejected && !this.filter.returned && !this.filter.student.length) {
        return this.request
      }
      return this.request.filter(req =>
        (this.filter.pending && req["status_request"] === "Pending") ||
        (this.filter.approved && req["status_request"] === "Approved") ||
        (this.filter.rejected && req["status_request"] === "Rejected") ||
        (this.filter.returned && req["status_request"] === "Returned") ||
        (this.filter.student === req["student_name"])
      )
    }
  },

  created() {
    this.initRequest()
    this.studentList()
    console.log(this.request)
    console.log(this.student)
  },

  methods: {
    initRequest() {
      firebase.firestore()
        .collection("requestList")
        .get()
        .then((querySnapshot) => {

          querySnapshot.forEach(doc => {
            let reqDate = new Date(Number(doc.id))
            const data = {
              'id': doc.id,
              'book_id': doc.data().book_id,
              'book_name': doc.data().book_name,
              'request_date': reqDate.toISOString().slice(0, 10),
              'return_date': doc.data().return_date,
              'status_request': doc.data().status_request.charAt(0).toUpperCase() + doc.data().status_request.slice(1),
              'student_id': doc.data().student_id,
              'student_name': doc.data().student_name,
            }
            this.request.push(data)
          })
        })
    },

    studentList() {
      firebase.firestore()
        .collection("requestList")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            let name = doc.data().student_name
            if (this.student.indexOf(name) < 0) {
              this.student.push(name)
            }
          })
        })
    },

    close() {
      this.dialog = false
    },

    acceptDialog(item) {
      this.dialog = true
      this.dialogMsg = 'Approve this borrow request?'
      this.dialogStatus = 1
      this.currentRequest = Object.assign({}, item)
      this.currentRequestIndex = this.request.indexOf(item)
    },

    rejectDialog(item) {
      this.dialog = true
      this.dialogMsg = 'Reject this borrow request?'
      this.dialogStatus = 0
      this.currentRequest = Object.assign({}, item)
      this.currentRequestIndex = this.request.indexOf(item)
    },

    save() {
      if (this.dialogStatus === 1)
        this.updateStatusRequest("approved")
      else
        this.updateStatusRequest("rejected")
    },

    updateStatusRequest(status) {
      //console.log(`${ this.currentRequestIndex }`)
      const newDate = this.getNewDate();
      firebase.firestore()
        .collection("requestList")
        .doc(this.currentRequest["id"])
        .update({
          'status_request': status,
          'return_date': (status === "approved" ? newDate : "-")
        })
        .then(() => {
          this.request[this.currentRequestIndex]["status_request"] = status.charAt(0).toUpperCase() + status.slice(1)
          this.request[this.currentRequestIndex]["return_date"] = (status === "approved" ? newDate : "-")
          this.successMsg = `Request successfully ${status}`
          this.isSuccess = true
          setTimeout(() => {
            this.isSuccess = false
          }, 3000)
        })
        .catch(error => console.log(error))

      this.dialog = false
    },

    getNewDate() {
      let date = new Date();
      date.setDate(date.getDate() + 14);
      return date.toISOString().slice(0, 10)
    }
  }
}
</script>

<style>

</style>
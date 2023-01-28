<template>
  <v-data-table :headers="headers" :items="filteredLog" sort-by="title" :loading="!log.length" :search="search"
    loading-text="Audit log books..." class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat class="blue lighten-5">
        <v-toolbar-title class="font-weight-bold">Audit Book Log</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" @click="generatePDF">
          Generate PDF
        </v-btn>
      </v-toolbar>

      <!-- FILTER SECTION -->
      <template>
        <v-expansion-panels :disabled="log.length < 1" flat class="mb-4">
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
                  <div class="font-weight-bold">Activity:</div>
                  <v-row class="ml-1 mt-1">
                    <v-checkbox class="mt-0 mr-4" v-model="filter.insert">
                      <template v-slot:label>
                        Insert
                      </template>
                    </v-checkbox>
                    <v-checkbox class="mt-0 mr-4" v-model="filter.update">
                      <template v-slot:label>
                        Update
                      </template>
                    </v-checkbox>
                    <v-checkbox class="mt-0 mr-4" v-model="filter.delete">
                      <template v-slot:label>
                        Delete
                      </template>
                    </v-checkbox>
                  </v-row>
                </v-col>

                <!-- Time Log Range -->
                <v-col cols="6">
                  <div class="font-weight-bold">Time Log Range:</div>
                  <v-menu class="mt-1 pt-0" ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="filter.dates"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="dateRange" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                        v-on="on"></v-text-field>
                    </template>
                    <v-date-picker range v-model="filter.dates" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="closeCalendar">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.menu.save(filter.dates)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                
              </v-row>
            </v-expansion-panel-content>
            <v-divider class="mx-0"></v-divider>
          </v-expansion-panel>
        </v-expansion-panels>

      </template>
    </template>
    <template v-slot:no-data>
       <p>No book log data yet.</p>
      </template>
  </v-data-table>
</template>

<script>
import firebase from 'firebase'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default {
  data() {
    return {
      /*
      data table config
      */
      menu: false,
      loading: null,
      headers: [
        {
          text: 'Book ID',
          align: 'start',
          sortable: false,
          value: 'book_id',
        },
        { text: 'Title', value: 'book_title' },
        { text: 'Availability', value: 'book_status' },
        { text: 'Activity', value: 'activity' },
        { text: 'Time Log', value: 'time_date' }
      ],
      log: [],
      /*
      jsPDF config
      */
      heading: "Audit Book Log Report",
      /*
      Filter
      */
      search: '',
      filter: {
        dates: [],
        insert: false,
        delete: false,
        update: false,
      }

    }
  },

  computed: {
    filteredLog() {
      if (!this.filter.insert && !this.filter.delete && !this.filter.update && !this.filter.dates.length) {
        return this.log
      }
      return this.log.filter(log =>
        (this.filter.insert && log["activity"] === "Insert") ||
        (this.filter.update && log["activity"] === "Update") ||
        (this.filter.delete && log["activity"] === "Delete") ||
        (
          (new Date(this.filter.dates[0]) <= new Date(log["time_date"].substring(0,10))) && 
          (new Date(this.filter.dates[1]) >= new Date(log["time_date"].substring(0,10))) 
        ) 
      )
    },

    dateRange() {
      return this.filter.dates.join(' ~ ')
    }
  },

  created() {
    this.loading = true
    this.initLogs()
  },

  methods: {
    initLogs() {
      firebase.firestore()
        .collection('book_log')
        .get()
        .then(
          (querySnapshot) => {
            querySnapshot.forEach(doc => {
              let date = new Date(Number(doc.id))
              console.log(doc.id)
              const data = {
                'time_date': date.toISOString().slice(0, 19).replace('T', ' '),
                'book_id': doc.data().book_id,
                'book_title': doc.data().book_title,
                'book_status': (doc.data().book_status === true) ? "Available" : "Unavailable",
                'activity': doc.data().activity,
              }

              this.log.push(data)
            })
          }
        )
      this.loading = false
    },

    closeCalendar() {
      this.menu = false
      this.filter.dates = []
    },

    generatePDF() {
      const date = Date.now().toString();
      const columns = [
        { title: "Log Date", dataKey: "time_date" },
        { title: "Book ID", dataKey: "book_id" },
        { title: "Title", dataKey: "book_title" },
        { title: "Status", dataKey: "book_status" },
        { title: "Activity", dataKey: "activity" }
      ];

      const doc = new jsPDF({
        orientation: "potrait",
        unit: "in",
        format: "letter"
      });

      // text is placed using x, y coordinates
      doc.setFontSize(16).text(this.heading, 0.5, 1.0);
      // create a line under heading 
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      // Using autoTable plugin
      doc.autoTable({
        columns,
        body: this.filteredLog,
        margin: { left: 0.5, top: 1.25 }
      });

      // Creating footer and saving file
      doc
        .setFont("times", "italic", "500")
        .setFontSize(11)
        .setTextColor(0, 0, 0)
        .text(
          "Intergrated NILAM and Bochord",
          0.5,
          doc.internal.pageSize.height - 0.5
        )
        .save(`${date}_audit_log.pdf`);
    }
  }

}
</script>

<style>

</style>
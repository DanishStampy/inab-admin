<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title class="text-h3">Welcome back to INAB Admin Dashboard!</v-card-title>
          <v-divider class="mx-3"></v-divider>
          <v-card-text class="text-h5 mt-4">
            Duty list as Admin/Librarian:
            <v-list subheader three-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Manage Books</v-list-item-title>
                  <v-list-item-subtitle>Able to manage all books in library. If there's new books, you are able to insert the book data. Update the book info if necessary.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Response to Requests</v-list-item-title>
                  <v-list-item-subtitle>After students lend a books through apps, you need to give a response, either approve or reject.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Audit Log Report</v-list-item-title>
                  <v-list-item-subtitle>Every move or activity regarding to book in library, it will be recorded in a log. Therefore, you can generate the log in form of PDF.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>
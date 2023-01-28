<template>
  <div>
    <v-alert border="left" type="success" :value="isSuccess" elevation="4" transition="scroll-x-transition">{{
        successMsg
    }}</v-alert>

    <v-alert border="left" type="error" :value="isFailed" elevation="4" transition="scroll-x-transition">{{
        errMsg
    }}</v-alert>

    <v-data-table :headers="headers" :items="books" :search="search" :loading="!books.length" loading-text="Fetching books..."
      class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat class="blue lighten-5">
          <v-toolbar-title class="font-weight-bold">List of Books</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- Create/Edit book dialog -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Book
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field required v-model="editedBook.title" label="Book title"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field required v-model="editedBook.author" label="Author"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field required v-model.number="editedBook.pages" label="Pages"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select :items="lang" required v-model="editedBook.lang" label="Language"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field required auto-grow v-model="editedBook.genre" label="Genre"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea required auto-grow v-model="editedBook.summary" label="Summary"></v-textarea>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-radio-group required v-model="editedBook.type" label="Type">
                        <v-radio label="Fiction" value="fiction">
                        </v-radio>
                        <v-radio label="Non-Fiction" value="non fiction">
                        </v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-radio-group required auto-grow v-model="editedBook.availability" label="Availability">
                        <v-radio label="Available" value="true">
                        </v-radio>
                        <v-radio label="Unavailable" value="false">
                        </v-radio></v-radio-group>
                    </v-col>

                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Delete book dialog -->
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this book?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteBookConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>

         <!-- FILTER SECTION -->
       <template >
          <v-expansion-panels :disabled="books.length < 1" flat class="mb-4">
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

                <!-- Availability -->

                
              </v-expansion-panel-content>
              <v-divider class="mx-0"></v-divider>
            </v-expansion-panel>
          </v-expansion-panels>
          
        </template>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon color="black" class="mr-2" @click="editBook(item)">
          mdi-pencil
        </v-icon>
        <v-icon color="red" @click="deleteBook(item)">
          mdi-delete
        </v-icon>
        <v-icon color="blue lighten-2" class="ml-2" @click="bookDetails(item)">
          mdi-eye
        </v-icon>
      </template>
      <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template> -->
      <template v-slot:item.availability="{ item }">
        <v-chip :class="[item.availability === 'true' ? 'success' : 'red']">
          <v-icon class="white--text">
            {{ (item.availability === "true" ? "mdi-checkbox-marked-circle" : "mdi-close-circle") }}
          </v-icon>
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      errMsg: "",
      successMsg: "",
      isSuccess: false,
      isFailed: false,
      loading: null,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'Author', value: 'author' },
        { text: 'Genre', value: 'genre' },
        { text: 'Total Page(s)', value: 'pages' },
        { text: 'Availability', value: 'availability' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      books: [],
      lang: ["Malay", "Mandarin", "Tamil", "English"],
      editedIndex: -1,
      editedBook: {
        'id': '',
        'title': '',
        'author': '',
        'genre': '',
        'availability': '',
        'pages': 0,
        'summary': '',
        'lang': '',
        'type': ''
      },
      newBook: {
        'id': '',
        'title': '',
        'author': '',
        'genre': '',
        'availability': '',
        'pages': 0,
        'summary': '',
        'lang': '',
        'type': ''
      },
      search: '',
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Book' : 'Edit Book'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.loading = true
    this.initBooks()
  },

  methods: {
    initBooks() {
      firebase.firestore()
        .collection('books')
        .get().then(
          (querySnapshot) => {
            querySnapshot.forEach(doc => {
              const data = {
                'id': doc.id,
                'title': doc.data().title,
                'author': doc.data().author,
                'genre': doc.data().genre,
                'availability': doc.data().availability ? "true" : "false",
                'pages': doc.data().pages,
                'summary': doc.data().summary,
                'lang': doc.data().lang,
                'type': doc.data().type
              }

              this.books.push(data)
            })
          }
        )
        .catch(error => {
          this.errMsg = error.response.data.error.message
          this.isFailed = true
        })
      this.loading = false
    },

    editBook(book) {
      this.editedIndex = this.books.indexOf(book)
      this.editedBook = Object.assign({}, book)
      this.dialog = true
    },

    deleteBook(book) {
      this.editedIndex = this.books.indexOf(book)
      this.editedBook = Object.assign({}, book)
      this.dialogDelete = true
    },

    deleteBookConfirm() {
      let book = this.books[this.editedIndex]

      this.deleteBookDB(book["id"])
      this.addBookAuditLog(book, book["id"], "Delete");
      this.books.splice(this.editedIndex, 1)
      this.successMsg = "Successfully deleting the book!"
      this.isSuccess = true
      this.closeDelete()
    },

    closeDelete() {
      this.dialogDelete = false
      setTimeout(() => {
        this.isSuccess = false
      }, 3000)
      this.$nextTick(() => {
        this.editedBook = Object.assign({}, this.newBook)
        this.editedIndex = -1
      })
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.isSuccess = false
      }, 3000)
      this.$nextTick(() => {
        this.editedBook = Object.assign({}, this.newBook)
        this.editedIndex = -1
      })
    },

    save() {
      const book = this.editedBook
      if (this.editedIndex > -1) {
        this.updateBookDB(book)
        this.successMsg = "Successfully updating the book!"
      } else {
        this.createBookDB(book)
        this.successMsg = "Successfully inserting the book!"
      }
      this.isSuccess = true
      this.close()
    },

    updateBookDB(book) {
      let id = this.books[this.editedIndex]["id"]
      const temp = this.books[this.editedIndex]
      // console.log(book)
      // console.log(id)
      firebase.firestore()
        .collection("books")
        .doc(id)
        .update({
          'title': book.title,
          'author': book.author,
          'genre': book.genre,
          'availability': book.availability === "true" ? true : false,
          'pages': book.pages,
          'summary': book.summary,
          'lang': book.lang
        })
        .then(() => {
          // console.log(book)
          // console.log(temp)
          Object.assign(temp, book)
          this.addBookAuditLog(book, id, "Update");
          console.log("updated book!")
        })
        .catch(error => console.log(error))

    },

    createBookDB(book) {
      // need to re-declare bcs firestore will automatically
      // change the boolean into string
      book.availability = (book.availability === "true" ? true : false)
      delete book["id"]

      firebase.firestore()
        .collection("books")
        .add(book)
        .then((doc) => {
          this.books.push(book)
          this.books[this.books.length - 1]["id"] = doc.id
          this.addBookAuditLog(book, doc.id, "Insert");
          console.log("inserted book!")
        })
        .catch(error => console.log(error))

    },

    deleteBookDB(id) {
      console.log(id)
      firebase.firestore()
        .collection("books")
        .doc(id)
        .delete()
        .then(() => {
          console.log("book deleted")
        })
        .catch(error => console.log(error))
    },

    addBookAuditLog(book, id, activity) {
      const logData = {
        book_id: id,
        book_title: book.title,
        book_status: book.availability === "true" ? true : false,
        activity: activity
      }

      console.log(logData)
      console.log(Date.now().toString())

      firebase.firestore()
        .collection("book_log")
        .doc(Date.now().toString())
        .set(logData)
        .then(() => {
          console.log("log added")
        })
        .catch(error => console.log(error));
    },

    bookDetails(book) {
      this.editedIndex = this.books.indexOf(book)
      this.$router.push({
        name: "detailbook",
        params: {
          book_id: this.books[this.editedIndex]["id"]
        }
      })
    }

  }
}
</script>

<style>

</style>
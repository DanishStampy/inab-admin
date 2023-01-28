<template>
  <div>
    <v-alert border="left" type="success" :value="isSuccess" elevation="4" transition="scroll-x-transition">{{
    successMsg
}}</v-alert>

    <v-row>
      <v-col>
        <v-card class="" max-width="100%">
          <v-card-text>
            <p class="text-h4 text--primary">
              {{ book.title }} by <span class="blue--text"> {{ book.author }}</span>
            </p>
            <div>Summary:</div>
            <div class="text--primary">
              {{ book.summary }}
            </div>
            <v-row class="mt-2">
              <v-col cols="4">
                <div>Total Page(s)</div>
                <p class="text--primary">{{ book.pages }} pages</p>
              </v-col>
              <v-col cols="4">
                <div>Type:</div>
                <p class="text--primary">{{ book.type }}</p>
              </v-col>
              <v-col cols="4">
                <div>Genre:</div>
                <p class="text--primary">{{ book.genre }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card max-width="100%">
          <v-card-text>
            <p class="text-h4 text--primary">Book Barcode</p>
            <v-btn v-if="book.isSaved == undefined" @click="generateBarcode">
              Generate
            </v-btn>
            <div v-else>
              <v-btn class="ma-2 white--text" id="downloadBarcode" color="blue-grey" @click="downloadBarcode"
                download="">
                Download
                <v-icon class="ml-2">
                  mdi-cloud-download
                </v-icon>
              </v-btn>
              <v-btn class="ma-2" :class="[book.isSaved ? 'd-none' : '', ]" color="success" @click="saveBarcode">
                Save
                <v-icon class="ml-2">
                  mdi-check
                </v-icon>
              </v-btn>
              <VueBarcode id="barcode_book" :value="barcodeValue">
                Can't generate the barcode
              </VueBarcode>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import bookImg from "@/assets/logo.png"
import VueBarcode from "vue-barcode"
import firebase from "firebase"
import html2canvas from "html2canvas"

export default {
  data() {
    return {
      isSuccess: false,
      successMsg: '',
      barcodeValue: '',
      imageDataURL: null,
      book: {
        title: '',
        author: '',
        summary: '',
        pages: 0,
        genre: '',
        type: '',
        lang: '',
        isSaved: null,
      }
    }
  },

  components: {
    VueBarcode
  },

  created() {
    firebase.firestore()
      .collection("books")
      .doc(this.$route.params.book_id)
      .get()
      .then((doc) => {
        this.book.title = doc.data().title
        this.book.author = doc.data().author
        this.book.summary = doc.data().summary
        this.book.pages = doc.data().pages
        this.book.genre = doc.data().genre
        this.book.type = doc.data().type.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        this.book.lang = doc.data().lang
        this.book.isSaved = doc.data().isSaved
      })
  },

  computed: {
    bookId() {
      this.barcodeValue = this.$route.params.book_id
    }
  },

  methods: {
    generateBarcode() {
      this.barcodeValue = this.$route.params.book_id
      this.book.isSaved = false
    },

    downloadBarcode() {
      html2canvas(document.querySelector('#barcode_book'))
        .then((canvas) => {
          this.imageDataURL = canvas.toDataURL('image/png')

          // create anchor 
          const anchor = document.createElement('a')
          console.log(this.imageDataURL)
          anchor.href = this.imageDataURL
          anchor.download = `barcode_${this.barcodeValue}.png`
          // click it
          anchor.click()
        })
    },

    isBarcodeSaved() {
      return this.book.isSaved
    },

    saveBarcode() {
      firebase.firestore()
        .collection("books")
        .doc(this.$route.params.book_id)
        .update({
          isSaved: true
        })
        .then(() => {
          this.successMsg = "Book barcode is saved"
          this.isSuccess = true
        })
        .catch(error => {
          console.log(error)
        })

      setTimeout(() => {
        this.isSuccess = false
      }, 3000)
    }
  }
}
</script>

<style>

</style>
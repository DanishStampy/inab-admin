<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <DefaultLayout/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DefaultLayout from '@/layout/DefaultLayout.vue';

export default {
  name: 'App',
  components: {
    DefaultLayout
  },
  data: () => ({
    //
  }),
};
</script>

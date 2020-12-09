<template>
  <v-app>
    <v-app-bar
      absolute
      :clipped-left="clipped"
      dark
      :src="require('@/assets/app-bg.jpg')"
    >
      <v-spacer></v-spacer>
      <v-toolbar-title>Japanese Flash Card</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ "By Jason Liu" }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: "Vuetify.js",
    };
  },
};
</script>

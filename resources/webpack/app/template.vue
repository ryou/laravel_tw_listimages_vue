<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile v-for="list in lists" @click="initImages(list)">
          <v-list-tile-content>
            <v-list-tile-title>{{ list.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-sm>
        <v-layout row wrap>
          <v-flex
            lg2
            xs3
            v-for="image in images"
          >
            <v-card flat tile>
              <v-card-media
                :src="image.status.extended_entities.media[image.index].media_url_https"
                style="padding-top: 100%;"
                @click="showModal(image)"
              >
              </v-card-media>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-btn
        block
        large
        color="secondary"
        :loading="isLoading.addImage"
        @click.native="addImages"
        :disabled="isLoading.addImage"
      >
        もっと見る
      </v-btn>
    </v-content>

    <tweet-modal-component v-if="isVisible.tweetModal" :status="tweetModalProps.status" :index="tweetModalProps.index" @hide-modal="hideModal"></tweet-modal-component>

    <div class="fullLoader" v-show="isVisible.fullLoader" @click.stop>
      <v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
    </div>

  </v-app>
</template>

<script src="./script.js"></script>
<style src="../../../node_modules/vuetify/dist/vuetify.min.css"></style>

<style scoped>
.fullLoader {
  position: fixed;
  z-index: 5000;
  top: 0; bottom: 0;
  left: 0; right: 0;

  background: rgba(0, 0, 0, .5);

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

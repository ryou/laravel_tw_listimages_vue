<template>
  <v-app id="inspire" v-resize="updateLayoutCode">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile @click="initImages({ id_str: 'home', name: 'ホームタイムライン' })">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>ホームタイムライン</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group :value="true">
          <v-list-tile slot="item" @click="">
            <v-list-tile-action>
              <v-icon>list</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>リスト</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-for="list in lists" @click="initImages(list)"
            :class="{
              'list__tile-wrapper--current': currentList !== null && currentList.id_str === list.id_str,
            }"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ list.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>ログアウト</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ toolBarTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="recentImages">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon @click="isVisible.settingModal = true">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-sm mb-2>
        <v-layout row wrap>
          <v-flex
            lg2
            xs3
            v-for="image in displayImages"
          >
            <v-card flat tile>
              <v-card-media
                :src="`${image.status.extended_entities.media[image.index].media_url_https}:small`"
                style="padding-top: 100%;"
                @click="showModal(image)"
              >
              </v-card-media>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid grid-list-sm pb-3>
        <v-layout row wrap>
          <v-flex
            xs12
            offset-lg3
            lg6
          >
            <v-btn
              v-if="isVisible.moreBtn"
              block
              large
              color="secondary"
              :loading="isLoading.addImage"
              @click.native="addImages"
              :disabled="isLoading.addImage"
            >
              もっと見る
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>

      <v-dialog
        v-model="isVisible.loginModal"
        max-width="500px"
        persistent
      >
        <v-card>
          <v-card-text>
            Twitter認証が必要です。<br>
            ログインボタンを押して、認証に進んでください。
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat href="/auth/login">ログイン</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="isVisible.settingModal"
        max-width="500px"
        persistent
      >
        <v-card>
          <v-card-title>設定</v-card-title>
          <v-card-text>
            <v-switch label="リツイートを表示する" v-model="includeRts"></v-switch>
          </v-card-text>
        <v-card-actions>
          <v-btn flat @click="isVisible.settingModal = false">閉じる</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-content>

    <transition name="fade">
      <tweet-modal-component
        v-if="isVisible.tweetModal"
        :status="tweetModalProps.status"
        :index="tweetModalProps.index"
        @hide-modal="hideModal"
      ></tweet-modal-component>
    </transition>

    <transition name="fade">
      <div class="fullLoader" v-show="isVisible.fullLoader" @click.stop>
        <v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
      </div>
    </transition>

  </v-app>
</template>

<script src="./script.js"></script>
<style src="../../../node_modules/vuetify/dist/vuetify.min.css"></style>

<style>
.list__tile-wrapper--current .list__tile {
  background-color: rgba(0,0,0,.12);
}
</style>
<style scoped>
.fullLoader {
  position: fixed;
  z-index: 7;
  top: 0; bottom: 0;
  left: 0; right: 0;

  background: rgba(255, 255, 255, .8);

  display: flex;
  align-items: center;
  justify-content: center;
}

/* fade
----------------------------------------------------------*/
.fade-enter-active,
.fade-leave-active {
  transition: .2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

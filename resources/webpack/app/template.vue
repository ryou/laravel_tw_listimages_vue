<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile @click="pushView('top')">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>トップ</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="pushView('about')">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>このサイトについて</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="pushView('posts')">
          <v-list-tile-action>
            <v-icon>format_list_bulleted</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>記事一覧</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <transition :name="$store.state.transitionName" mode="out-in">
        <component :is="$store.state.currentView.instance"></component>
      </transition>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script src="./script.js"></script>
<style src="../../../node_modules/vuetify/dist/vuetify.min.css"></style>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


.slideleft-enter-active, .slideleft-leave-active {
  transition: transform .3s, opacity .3s;
}
.slideleft-leave {
  transform: translateX(0);
  opacity: 1;
}
.slideleft-leave-to {
  transform: translateX(-50%);
  opacity: 0;
}
.slideleft-enter {
  transform: translateX(50%);
  opacity: 0;
}
.slideleft-enter-to {
  transform: translateX(0);
  opacity: 1;
}


.slideright-enter-active, .slideright-leave-active {
  transition: transform .3s, opacity .3s;
}
.slideright-leave {
  transform: translateX(0);
  opacity: 1;
}
.slideright-leave-to {
  transform: translateX(50%);
  opacity: 0;
}
.slideright-enter {
  transform: translateX(-50%);
  opacity: 0;
}
.slideright-enter-to {
  transform: translateX(0);
  opacity: 1;
}
</style>

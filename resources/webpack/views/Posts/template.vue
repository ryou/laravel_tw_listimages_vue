<template>
  <v-container>
    <v-list two-line>
      <template v-for="(post, index) in posts">
        <v-list-tile
          @click="$store.commit('pushView', {
            id: 'post',
            props: { id: index },
          })"
          :key="index"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ post.title }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ post.content }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="index < posts.length-1" :key="index"></v-divider>
      </template>
    </v-list>
  </v-container>
</template>

<script src="./script.js"></script>

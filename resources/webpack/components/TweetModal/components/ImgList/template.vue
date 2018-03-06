<template>
  <ul class="m-tweetModal_imgList" :style="styleObj">
    <li v-for="image in images" class="m-tweetModal_imgWrapper">
      <img
        :src="image.media_url_https"
        class="m-tweetModal_img"
        @click.stop="onClickImg"
        @touchstart.stop.prevent="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
        @touchend.stop.prevent="onTouchEnd">
    </li>
  </ul>
</template>

<script src="./script.js"></script>

<template>
  <div class="m-tweetModal" @click="hideModal">
    <local-img-list-component :images="status.extended_entities.media" :disp-index="dispIndex" @on-click-img="toggleBlob" @img-to-right="prevImg" @img-to-left="nextImg"></local-img-list-component>

      <div class="m-tweetModal_blob" @click.stop>
        <transition name="slideup">
          <button v-show="blobIsVisible" class="m-tweetModal_close" @click="hideModal"><i class="fa fa-times"></i></button>
        </transition>
        <div class="m-tweetModal_nav">
          <transition name="slideleft">
            <div v-show="prevImgIsExist && blobIsVisible" class="m-tweetModal_navItem m-tweetModal_navItem-prev" @click="prevImg"><i class="fa fa-chevron-left"></i></div>
          </transition>
          <transition name="slideright">
            <div v-show="nextImgIsExist && blobIsVisible" class="m-tweetModal_navItem m-tweetModal_navItem-next" @click="nextImg"><i class="fa fa-chevron-right"></i></div>
          </transition>
        </div>
        <transition name="slidedown">
          <div v-show="blobIsVisible" class="m-tweetModal_textContainer">
            <div class="l-container">
              <div class="m-tweet01 m-tweet01-textWhite">
                <div v-if="status.retweet_user" class="m-tweet01_row">
                  <div class="m-tweet01_leftCol u-align-right">
                    <i class="fa fa-retweet u-color-green"></i>
                  </div>
                  <div class="m-tweet01_rightCol">
                    <p class="u-font-small"><a :href="'https://twitter.com/' + status.retweet_user.screen_name" target="_blank" class="u-link-text02">@{{ status.retweet_user.name }}</a>さんがリツイート</p>
                  </div>
                </div>
                <div class="m-tweet01_row">
                  <div class="m-tweet01_leftCol">
                    <div class="m-tweet01_icon"><a :href="'https://twitter.com/' + status.user.screen_name" class="u-ov"><img :src="status.user.profile_image_url"></a></div>
                  </div>
                  <div class="m-tweet01_rightCol">
                    <div class="m-tweet01_userInfo">
                      <a :href="'https://twitter.com/' + status.user.screen_name" target="_blank" class="m-tweet01_name u-link-text02">@{{ status.user.name }}</a>
                      <a :href="'https://twitter.com/' + status.user.screen_name" target="_blank" class="m-tweet01_screenName u-link-text02">@{{ status.user.screen_name }}</a><!--
                      -->・<a :href="'https://twitter.com/' + status.user.screen_name + '/status/' + status.id_str" target="_blank" class="m-tweet01_date u-link-text02">@{{ dateStr }}</a>
                    </div>
                    <p class="m-tweet01_text">@{{ status.text }}</p>
                  </div>
                </div>
                <div class="m-tweet01_row">
                  <div class="m-tweet01_leftCol"></div>
                  <div class="m-tweet01_rightCol">
                    <ul class="m-tweet01_actionBtns">
                      <li class="m-tweet01_actionBtn"><action-btn-component icon="fa-retweet" :initial-state="status.retweeted" :activate-url="retweetUrl" :deactivate-url="unretweetUrl" text="リツイート"></action-btn-component></li>
                      <li class="m-tweet01_actionBtn"><action-btn-component icon="fa-heart" :initial-state="status.favorited" :activate-url="createFavUrl" :deactivate-url="destroyFavUrl" text="いいね"></action-btn-component></li>
                      <li class="m-tweet01_actionBtn">
                        <a :href="img.media_url + ':orig'" target="_blank" class="m-actionBtn"><i class="fa fa-picture-o"></i><br>オリジナル画像</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

    </div>
</template>

<script src="./script.js"></script>
<style>

.l-container {
  margin: 0 auto;
  padding: 0 10px;
  width: 960px;
}

.m-tweetModal {
  position: fixed;
  z-index: 200;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  overflow: hidden;
}
.m-tweetModal_imgList {
  height: 100%;
  width: 10000px;
}
.m-tweetModal_imgWrapper {
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
}
.m-tweetModal_img {
  max-width: 100%;
  max-height: 100%;
}
.m-tweetModal_loading {
  font-size: 4.0rem;
  color: #fff;
}
.m-tweetModal_blob {
}
.m-tweetModal_close {
  color: #fff;
  font-size: 3.0rem;
  line-height: 1.0;
  padding: 10px;
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  cursor: pointer;
  outline: none;
}
.m-tweetModal_nav {

}
.m-tweetModal_navItem {
  position: absolute;
  top: 50%;
  font-size: 4.0rem;
  margin-top: -3.5rem;
  line-height: 1.0;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  padding: 1.5rem;
  cursor: pointer;
}
.m-tweetModal_navItem-next {
  right: 0;
}
.m-tweetModal_textContainer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.3) 40px, rgba(0,0,0,0.5));
  color: #fff;
  padding: 40px 0 10px;
}



.m-tweet01 {
}
.m-tweet01_row {
  display: table;
}
.m-tweet01_leftCol {
  display: table-cell;
  padding-right: 10px;
  width: 48px;
}
.m-tweet01_rightCol {
  display: table-cell;
}
.m-tweet01_icon img {
  border-radius: 5px;
  width: 48px;
  height: 48px;
}
.m-tweet01_userInfo {

}
.m-tweet01_name {
  font-weight: bold;
}
.m-tweet01_screenName {
  font-size: 1.2rem;
}
.m-tweet01_date {
  font-size: 1.1rem;
}
.m-tweet01_text {
  font-size: 1.4rem;
  @include mq-sp {
    font-size: 1.3rem;
    line-height: 1.4;
  }
}
.m-tweet01_actionBtns {
  padding-top: 7px;
}
.m-tweet01_actionBtn {
  display: inline-block;
  margin-right: 5px;
  vertical-align: top;
}
.m-tweet01-textWhite {
  color: #fff;
}


.m-actionBtn {
  display: inline-block;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  color: #fff;
  font-size: 1.0rem;
  text-align: center;
  vertical-align: top;
}
</style>

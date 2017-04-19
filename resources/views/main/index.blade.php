@extends('layouts.meta')

@section('body')
  <div class="l-wrapper">
    <div id="app" :class="classObj">
      <div v-show="mainColIsVisible" class="l-mainCol">
        <div class="m-appBox">
          <div class="m-appBox_head">
            <div class="m-appBox_headLeft"></div>
            <div class="m-appBox_headTitle">リスト一覧</div>
            <div class="m-appBox_headRight"></div>
          </div>
          <div class="m-appBox_content">
            <ul class="m-list">
              <li v-for="item in listData.list" class="m-list_item m-list_item-btn" :class="{'is-active': item.isSelected}" @@click="showList(item)">@{{ item.name }}<span class="m-list_arrowIcn"><i class="fa fa-chevron-right"></i></span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="l-subCol">
        <div class="m-appBox">
          <div class="m-appBox_head">
            <div class="m-appBox_headLeft"></div>
            <div class="m-appBox_headTitle" @@click="scrollToTop">@{{ selectedList.name }}</div>
            <div class="m-appBox_headRight"></div>
          </div>
          <div class="m-appBox_content">
            <img-list-component @@show-modal="showTweetModal" v-if="imgListIsVisible" :list="selectedList"></img-list-component>
          </div>
        </div>
      </div>
      <tweet-modal-component v-if="tweetModalIsVisible" :status="tweetModalProps.status" :index="tweetModalProps.index" @@hide-modal="hideTweetModal"></tweet-modal-component>
    </div>
  </div>

  {{-- template --}}
  <script type="text/x-template" id="list-component-template">
  </script>
  <script type="text/x-template" id="img-list-component-template">
    <transition name="fade">
      <div class="m-imgList">
        <transition name="fade">
          <div class="m-imgList_content" v-show="dispImages">
            <ul class="m-imgList_images">
              <li v-for="item in images" class="m-imgList_imgItem"><img-component @@show-modal="showModal" :status="item.status" :index="item.index"></img-component></li>
            </ul>
            <div class="m-imgList_loadBtn">
              <ajax-btn01-component v-show="ajaxBtnIsVisible" @@success="addImages" :url="ajaxUrl"></ajax-btn01-component>
            </div>
          </div>
        </transition>
        <div v-show="!dispImages" class="m-imgList_loading"><i class="fa fa-3x fa-spinner fa-pulse"></i></div>
      </div>
    </transition>
  </script>
  <script type="text/x-template" id="tweet-modal-component-template">
    <transition name="fade">
      <div class="m-tweetModal" @@click="hideModal">
        <div class="m-tweetModal_imgWrapper">
          <img v-show="!imgIsLoading" :src="img.media_url" class="m-tweetModal_img" @@click.stop="toggleBlob" @@load="completeLoading">
          <i v-show="imgIsLoading" class="m-tweetModal_loading fa fa-spinner fa-pulse"></i>
        </div>
        <transition name="fade">
          <div v-show="blobIsVisible" class="m-tweetModal_blob" @@click.stop>
            <button class="m-tweetModal_close" @@click="hideModal"><i class="fa fa-times"></i></button>
            <div class="m-tweetModal_nav">
              <div v-show="prevImgIsExist" class="m-tweetModal_navItem m-tweetModal_navItem-prev" @@click="prevImg"><i class="fa fa-chevron-left"></i></div>
              <div v-show="nextImgIsExist" class="m-tweetModal_navItem m-tweetModal_navItem-next" @@click="nextImg"><i class="fa fa-chevron-right"></i></div>
            </div>
            <div class="m-tweetModal_textContainer">
              <div class="l-container">
                <div class="m-tweet01 m-tweet01-textWhite">
                  <div v-if="status.retweet_user" class="m-tweet01_row">
                    <div class="m-tweet01_leftCol u-align-right">
                      <i class="fa fa-retweet u-color-green"></i>
                    </div>
                    <div class="m-tweet01_rightCol">
                      <p class="u-font-small"><a :href="'https://twitter.com/' + status.retweet_user.screen_name" target="_blank">@{{ status.retweet_user.name }}</a>さんがリツイート</p>
                    </div>
                  </div>
                  <div class="m-tweet01_row">
                    <div class="m-tweet01_leftCol">
                      <div class="m-tweet01_icon"><a :href="'https://twitter.com/' + status.user.screen_name"><img :src="status.user.profile_image_url"></a></div>
                    </div>
                    <div class="m-tweet01_rightCol">
                      <div class="m-tweet01_userInfo">
                        <a :href="'https://twitter.com/' + status.user.screen_name" target="_blank" class="m-tweet01_name">@{{ status.user.name }}</a>
                        <a :href="'https://twitter.com/' + status.user.screen_name" target="_blank" class="m-tweet01_screenName">@@{{ status.user.screen_name }}</a><!--
                        -->・<a :href="'https://twitter.com/' + status.user.screen_name + '/status/' + status.id_str" target="_blank" class="m-tweet01_date">@{{ dateStr }}</a>
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
          </div>
        </transition>
      </div>
    </transition>
  </script>
  <script type="text/x-template" id="ajax-btn01-component-template">
    <button class="m-btn m-btn-full" @@click="startAjax"><span v-show="!isLoading">読み込み</span><i v-show="isLoading" class="fa fa-circle-o-notch fa-spin"></i></button>
  </script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="/common/js/lib/jquery.min.js"><\\/script>')</script>
  <script src="https://unpkg.com/vue"></script>
  @loadLocalJS(/common/js/vueMain.js)
@endsection

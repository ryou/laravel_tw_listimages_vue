@extends('layouts.meta')

@section('body')
  <div class="l-wrapper">
    <div id="app" :class="classObj">
      <transition name="slideleft">
        <div v-show="mainColIsVisible" class="l-mainCol">
          <div class="m-appBox">
            <div class="m-appBox_head">
              <div class="m-appBox_headLeft"></div>
              <div class="m-appBox_headTitle">リスト一覧</div>
              <div class="m-appBox_headRight">
                @if (config('app.use_test_account') === false)
                <div class="m-appBox_headBtn"><a href="/auth/logout"><i class="fa fa-sign-out"></i></a></div>
                @endif
              </div>
            </div>
            <div class="m-appBox_content">
              <ul class="m-list">
                <list-item-component v-for="item in list" :item-data="item" :selected-list="selectedList" @@show-list="showList"></list-item-component>
              </ul>
            </div>
          </div>
        </div>
      </transition>
      <div class="l-subCol">
        <div class="m-appBox">
          <div class="m-appBox_head">
            <div class="m-appBox_headLeft">
              <div class="m-appBox_headBtn"><i @@click="showListSelector" v-if="!isSplitView" class="fa fa-list"></i></div>
            </div>
            <div class="m-appBox_headTitle" @@click="scrollToTop">@{{ selectedList.name }}</div>
            <div class="m-appBox_headRight"></div>
          </div>
          <div class="m-appBox_content">
            <img-list-component @@show-modal="showTweetModal" v-if="imgListIsVisible" :list="selectedList"></img-list-component>
          </div>
        </div>
      </div>
      <tweet-modal-component v-if="tweetModalIsVisible" :status="tweetModalProps.status" :index="tweetModalProps.index" @@hide-modal="hideTweetModal"></tweet-modal-component>
      <transition name="fade">
        <div v-show="initialLoaderIsVisible" class="m-wholeLoading">
          <div class="m-wholeLoading_filter">
            <div class="m-wholeLoading_loading"><i class="fa fa-spinner fa-pulse"></i></div>
          </div>
        </div>
      </transition>
    </div>
  </div>

  {{-- template --}}
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
        <ul class="m-tweetModal_imgList" :style="imgListStyleObj">
          <li v-for="(image, index) in status.extended_entities.media" class="m-tweetModal_imgWrapper">
            <img :src="getMediaData(index).media_url" class="m-tweetModal_img" @@click.stop="toggleBlob">
          </li>
        </ul>

          <div class="m-tweetModal_blob" @@click.stop>
            <transition name="slideup">
              <button v-show="blobIsVisible" class="m-tweetModal_close" @@click="hideModal"><i class="fa fa-times"></i></button>
            </transition>
            <div class="m-tweetModal_nav">
              <transition name="slideleft">
                <div v-show="prevImgIsExist && blobIsVisible" class="m-tweetModal_navItem m-tweetModal_navItem-prev" @@click="prevImg"><i class="fa fa-chevron-left"></i></div>
              </transition>
              <transition name="slideright">
                <div v-show="nextImgIsExist && blobIsVisible" class="m-tweetModal_navItem m-tweetModal_navItem-next" @@click="nextImg"><i class="fa fa-chevron-right"></i></div>
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
                          <a :href="'https://twitter.com/' + status.user.screen_name" target="_blank" class="m-tweet01_screenName u-link-text02">@@{{ status.user.screen_name }}</a><!--
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
    </transition>
  </script>
  <script type="text/x-template" id="ajax-btn01-component-template">
    <button class="m-btn m-btn-full" @@click="startAjax"><span v-show="!isLoading">更に読み込む</span><i v-show="isLoading" class="fa fa-circle-o-notch fa-spin"></i></button>
  </script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="/common/js/lib/jquery.min.js"><\\/script>')</script>
  @if (config('app.debug'))
    <script src="https://unpkg.com/vue"></script>
  @else
    <script src="/common/js/lib/vue.min.js"></script>
  @endif
  @loadLocalJS(/common/js/vueMain.js)
@endsection

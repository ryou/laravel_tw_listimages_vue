@extends('layouts.meta')

@section('body')
  <div class="l-wrapper">
    <div id="app">
      <div class="l-header">
        <nav-component @@show-list-modal="showListModal"></nav-component>
      </div>
      <div class="l-content">
        <div class="l-container">
          <img-list-component @@show-modal="showTweetModal" v-if="imgListIsVisible" :list="selectedList"></img-list-component>
        </div>
      </div>
      <div class="l-footer">
      </div>
      <list-modal-component @@select-list="showList" :list-data="listData" v-show="listModalIsVisible" @@hide-modal="hideListModal"></list-modal-component>
      <tweet-modal-component v-if="tweetModalIsVisible" :status="tweetModalProps.status" :index="tweetModalProps.index" @@hide-modal="hideTweetModal"></tweet-modal-component>
    </div>
  </div>

  {{-- template --}}
  <script type="text/x-template" id="nav-component-template">
    <nav class="m-nav">
      <div class="m-nav_main">
        <div class="l-container">
          <button class="m-nav_btn m-nav_btn-list" @@click="showListModal">
            <i class="m-nav_icon fa fa-list"></i><br>
            リスト
          </button>
          @if (config('app.use_test_account') === false)
          <a class="m-nav_btn m-nav_btn-logout" href="/auth/logout">
            <i class="m-nav_icon fa fa-sign-out"></i><br>
            ログアウト
          </a>
          @endif
        </div>
      </div>
    </nav>
  </script>
  <script type="text/x-template" id="list-modal-component-template">
    <transition name="fade">
      <div class="m-modal">
        <div class="m-modal_filter" @@click="hideModal">
          <div class="m-modal_mainWrapper">
            <div class="m-modal_main" @@click.stop>
              <div class="m-modal_title">
                表示したいリストを選択して下さい。
                <div class="m-modal_close" @@click="hideModal"><i class="fa fa-times"></i></div>
              </div>
              <div class="m-modal_content">
                <div v-show="listData.isLoading" class="u-align-center"><i class="fa fa-spinner fa-pulse fa-2x"></i></div>
                <ul class="m-list" v-show="!listData.isLoading">
                  <li v-for="item in listData.list" class="m-list_item m-list_item-btn" @@click="selectList(item)">@{{ item.name }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </script>
  <script type="text/x-template" id="img-list-component-template">
    <transition name="fade">
      <div class="m-imgList">
        <p class="m-imgList_listName">@{{ list.name }}</p>
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

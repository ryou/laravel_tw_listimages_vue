/* service worker
----------------------------------------------------------*/
if ('serviceWorker' in navigator) {
  // register service worker
  navigator.serviceWorker.register('/common/js/service-worker.js');
}

/* vue
----------------------------------------------------------*/
var Vue = require('vue');
var $ = require('jquery');
var ajaxBtn01Component = require('./components/ajaxBtn01');
var imgListComponent = require('./components/imgList');
var tweetModalComponent = require('./components/TweetModal');

var listItemComponent = {
  data: function() {
    return {};
  },
  props: ['itemData', 'selectedList'],
  template: '<li class="m-list_item m-list_item-btn" :class="classObj" @click="showList">' +
            '{{ itemData.name }}<span class="m-list_arrowIcn"><i class="fa fa-chevron-right"></i></span>' +
            '</li>',
  methods: {
    showList: function() {
      this.$emit('show-list', this.itemData);
    }
  },
  computed: {
    classObj: function() {
      return {
        'is-active': (this.itemData.id_str === this.selectedList.id_str)
      };
    }
  }
};

var app = new Vue({
  el: '#app',
  data: {
    // 表示・非表示管理用変数
    mainColIsVisible: true,
    imgListIsVisible: false,
    tweetModalIsVisible: false,

    // 各種データ
    list: [],
    selectedList: {name: ''},
    tweetModalProps: {
      status: null,
      index: 0
    },

    // その他
    isSplitView: true
  },
  components: {
    'list-item-component': listItemComponent,
    'img-list-component': imgListComponent,
    'tweet-modal-component': tweetModalComponent
  },
  computed: {
    classObj: function() {
      return {
        'is-split': this.isSplitView
      };
    },
    initialLoaderIsVisible: function() {
      return (this.list.length <= 0);
    }
  },
  created: function() {
    if ($(window).width() >= 768) {
      this.isSplitView = true;
    } else {
      this.isSplitView = false;
    }

    var self = this;
    $.getJSON('/api/get_lists', function(data) {
      if (data.length <= 0) {
        alert('認証したアカウントに保存されているリストが見つかりませんでした。');
      } else {
        self.setListData(data);
      }
    })
    .fail(function() {
      alert('データの読み込みに失敗しました。ページを再読込して下さい。');
    });
  },
  methods: {
    setListData: function(data) {
      this.list = data;
    },
    showList: function(item) {
      this.imgListIsVisible = true;
      this.selectedList = item;
      if (this.isSplitView === false) this.mainColIsVisible = false;
    },
    showHome: function() {
      this.imgListIsVisible = true;
      this.selectedList = { id_str: 'home' };
      if (this.isSplitView === false) this.mainColIsVisible = false;
    },
    showListSelector: function() {
      this.mainColIsVisible = true;
    },
    showTweetModal: function(status, index) {
      this.tweetModalProps.status = status;
      this.tweetModalProps.index = index;
      this.tweetModalIsVisible = true;
    },
    hideTweetModal: function() {
      this.tweetModalIsVisible = false;
    },
    scrollToTop: function() {
      var duration = 300;
      $('.l-subCol .m-appBox_content').stop().animate({scrollTop:0}, duration, 'swing');
    }
  }
});

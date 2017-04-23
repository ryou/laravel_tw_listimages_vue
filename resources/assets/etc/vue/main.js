;(function() {
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
      initialLoaderIsVisible: true,
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
      'list-item-component': listItemComponent
    },
    computed: {
      classObj: function() {
        return {
          'is-split': this.isSplitView
        };
      }
    },
    created: function() {
      if ($(window).width() >= 768) {
        this.isSplitView = true;
      } else {
        this.isSplitView = false;
      }
    },
    methods: {
      setListData: function(data) {
        this.initialLoaderIsVisible = false;
        this.list = data;
      },
      showList: function(item) {
        this.imgListIsVisible = true;
        this.selectedList = item;
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

  $.getJSON('/api/get_lists', function(data) {
    app.setListData(data);
  })
  .fail(function() {
    alert('データの読み込みに失敗しました。ページを再読込して下さい。');
  });
})();

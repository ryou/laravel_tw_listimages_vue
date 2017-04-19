;(function() {
  var app = new Vue({
    el: '#app',
    data: {
      mainColIsVisible: true,
      isSplitView: true,
      imgListIsVisible: false,
      tweetModalIsVisible: false,
      listData: {
        isLoading: true,
        list: []
      },
      selectedList: {name: ''},
      tweetModalProps: {
        status: null,
        index: 0
      }
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
        this.listData.isLoading = false;

        // 選択状態もデータに持たせるために追加する
        data.forEach(function(e, i, a) {
          e.isSelected = false;
        });
        this.listData.list = data;
      },
      showList: function(item) {
        // TODO: 選択状態を保持する処理に関して、もっと簡潔に書けるはず
        this.listData.list.forEach(function(e, i, a) {
          e.isSelected = false;
        });
        item.isSelected = true;

        this.imgListIsVisible = true;
        this.selectedList = item;
        if (this.isSplitView === false) this.mainColIsVisible = false;
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

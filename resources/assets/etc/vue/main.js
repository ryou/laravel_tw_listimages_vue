;(function() {
  var app = new Vue({
    el: '#app',
    data: {
      listModalIsVisible: true,
      imgListIsVisible: false,
      tweetModalIsVisible: false,
      listData: {
        isLoading: true,
        list: []
      },
      selectedList: null,
      tweetModalProps: {
        status: null,
        index: 0
      }
    },
    methods: {
      showListModal: function() {
        this.listModalIsVisible = true;
      },
      hideListModal: function() {
        this.listModalIsVisible = false;
      },
      setListData: function(data) {
        this.listData.isLoading = false;
        this.listData.list = data;
      },
      showList: function(item) {
        this.imgListIsVisible = true;
        this.selectedList = item;
      },
      showTweetModal: function(status, index) {
        this.tweetModalProps.status = status;
        this.tweetModalProps.index = index;
        this.tweetModalIsVisible = true;
      },
      hideTweetModal: function() {
        this.tweetModalIsVisible = false;
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

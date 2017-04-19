;(function() {
  var actionBtn = {
    data: function() {
      return {
        isActive: null
      };
    },
    props: ['activateUrl', 'deactivateUrl', 'icon', 'initialState', 'text'],
    template: '<button class="m-actionBtn" :class="classObj" @click="changeState"><i class="fa" :class="icon"></i><br>{{ text }}</button>',
    computed: {
      classObj: function() {
        return {
          'is-active': this.isActive
        };
      }
    },
    created: function() {
      this.isActive = this.initialState;
    },
    methods: {
      changeState: function() {
        var url = '';
        if (this.isActive) {
          url = this.deactivateUrl;
        } else {
          url = this.activateUrl;
        }
        this.isActive = !this.isActive;

        $.ajax({
          url: url,
          type: 'POST',
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
        })
        .done(function() {
          //
        })
        .always(function() {
          //
        });
      }
    }
  };

  Vue.component('tweet-modal-component', {
    data: function() {
      return {
        imgIsLoading: true,
        blobIsVisible: true,
        dispIndex: null
      };
    },
    props: ['status', 'index'],
    template: '#tweet-modal-component-template',
    components: {
      'action-btn-component': actionBtn
    },
    computed: {
      img: function() {
        return this.status.extended_entities.media[this.dispIndex];
      },
      prevImgIsExist: function() {
        return (this.dispIndex > 0);
      },
      nextImgIsExist: function() {
        var imgNum = this.status.extended_entities.media.length;
        return (this.dispIndex < imgNum-1);
      },
      dateStr: function() {
        var dateObj = new Date(this.status.created_at);
        return (dateObj.getMonth()+1) + '/' + dateObj.getDate() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes();
      },
      retweetUrl: function() {
        return '/api/retweet/' + this.status.id_str;
      },
      unretweetUrl: function() {
        return '/api/unretweet/' + this.status.id_str;
      },
      createFavUrl: function() {
        return '/api/add_favorite/' + this.status.id_str;
      },
      destroyFavUrl: function() {
        return '/api/delete_favorite/' + this.status.id_str;
      }
    },
    created: function() {
      this.dispIndex = this.index;
    },
    methods: {
      toggleBlob: function() {
        this.blobIsVisible = !this.blobIsVisible;
      },
      hideModal: function() {
        this.$emit('hide-modal');
      },
      nextImg: function() {
        if (this.nextItemIsExist === false) return;

        this.dispIndex++;
        this.imgIsLoading = true;
      },
      prevImg: function() {
        if (this.prevItemIsExist === false) return;

        this.dispIndex--;
        this.imgIsLoading = true;
      },
      completeLoading: function() {
        this.imgIsLoading = false;
      }
    }
  });
})();

;(function() {
  Vue.component('ajax-btn01-component', {
    data: function() {
      return {
        isLoading: false
      };
    },
    props: ['url'],
    template: '#ajax-btn01-component-template',
    methods: {
      startAjax: function() {
        if (this.isLoading) return;
        this.isLoading = true;

        var self = this;
        $.getJSON(self.url, function(data) {
          self.$emit('success', data);
          self.isLoading = false;
        })
        .fail(function() {
          alert('データの読み込みに失敗しました。ページを再読込して下さい。');
        });

      }
    }
  });
})();

;(function() {
  var imgComponent = {
    data: function() {
      return {};
    },
    props: ['status', 'index'],
    template: '<div class="m-imgList_img" :style="styleObj" @click="showModal"></div>',
    computed: {
      img: function() {
        return this.status.extended_entities.media[this.index];
      },
      styleObj: function() {
        return {
          'background-image': 'url(' + this.img.media_url + ':thumb)'
        };
      }
    },
    methods: {
      showModal: function() {
        this.$emit('show-modal', this.status, this.index);
      }
    }
  };

  Vue.component('img-list-component', {
    data: function() {
      return {
        dispImages: false,
        images: [],
        currentPage: null,
        newImgIsLoading: false,
        ajaxBtnIsVisible: true
      };
    },
    props: ['list'],
    template: '#img-list-component-template',
    // TODO: 画像読み込みに関するコードの重複を修正すること
    created: function() {
      this.dispImages = false;
      this.currentPage = null;

      var self = this;
      $.getJSON('/api/get_list_images/' + self.list.id_str + '/1', function(data) {
        self.images = data;
        self.dispImages = true;
        self.currentPage = 1;
      })
      .fail(function() {
        alert('データの読み込みに失敗しました。ページを再読込して下さい。');
      });
    },
    watch: {
      list: function(newList) {
        this.dispImages = false;
        this.ajaxBtnIsVisible = true;
        this.currentPage = 1;

        var self = this;
        $.getJSON('/api/get_list_images/' + newList.id_str + '/1', function(data) {
          self.images = data;
          self.dispImages = true;
        })
        .fail(function() {
          alert('データの読み込みに失敗しました。ページを再読込して下さい。');
        });
      }
    },
    components: {
      'img-component': imgComponent,
    },
    computed: {
      ajaxUrl: function() {
        return '/api/get_list_images/' + this.list.id_str + '/' + (this.currentPage+1);
      }
    },
    methods: {
      showModal: function(status, index) {
        this.$emit('show-modal', status, index);
      },
      addImages: function(images) {
        if (images.length <= 0) this.ajaxBtnIsVisible = false;
        this.images = this.images.concat(images);
        this.currentPage++;
      }
    }
  });
})();

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

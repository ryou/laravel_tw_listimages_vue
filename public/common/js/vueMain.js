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

  var imgListComponent = {
    data: function() {
      return {
        touches: [],
        isMoveAnimation: false
      };
    },
    props: ['images', 'dispIndex'],
    template: '<ul class="m-tweetModal_imgList" :style="styleObj">' +
                '<li v-for="image in images" class="m-tweetModal_imgWrapper">' +
                  '<img :src="image.media_url" class="m-tweetModal_img" @click.stop="onClickImg" @touchstart.stop.prevent="onTouchStart" @touchmove.stop.prevent="onTouchMove" @touchend.stop.prevent="onTouchEnd">' +
                '</li>' +
              '</ul>',
    computed: {
      styleObj: function() {
        var style = {
          'transform': 'translateX(calc(-' + this.dispIndex * 100 + 'vw + ' + this.touchMove.x + 'px))'
        };
        if (this.isMoveAnimation) {
          style.transition = '.2s';
        }

        return style;
      },
      touchMove: function() {
        if (this.touches.length <= 0) {
          return {x: 0, y: 0};
        }

        return {
          x: this.touches[this.touches.length - 1].x - this.touches[0].x,
          y: this.touches[this.touches.length - 1].y - this.touches[0].y
        };
      }
    },
    watch: {
      dispIndex: function() {
        this.isMoveAnimation = true;

        // TODO:ここらへんのアニメーション終了検知無理矢理過ぎるのでなおす
        var self = this;
        setTimeout(function() {
          self.isMoveAnimation = false;
        }, 200);
      }
    },
    methods: {
      getCurrentUTime: function() {
        var date = new Date();
        return date.getTime();
      },
      pushNewTouch: function(touch) {
        this.touches.push(touch);
      },
      onClickImg: function() {
        this.$emit('on-click-img');
      },
      onTouchStart: function(e) {
        if (this.isMoveAnimation) return;

        this.pushNewTouch({
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY,
          time: this.getCurrentUTime()
        });
      },
      onTouchMove: function(e) {
        this.pushNewTouch({
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY,
          time: this.getCurrentUTime()
        });
      },
      onTouchEnd: function(e) {
        console.log('touch end');

        this.pushNewTouch({
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY,
          time: this.getCurrentUTime()
        });

        // TODO:ここの実装かなり雑なので整える
        var currentTime = this.getCurrentUTime();
        var tmpTouches = this.touches.slice();
        tmpTouches.reverse();
        var tmpTouch;
        tmpTouches.forEach(function(e, i, a) {
          if (currentTime - e.time < 100) {
            tmpTouch = e;
            console.log('tmp touch time: ' + e.time);
          }
        });
        var tmpX = this.touches[this.touches.length - 1].x - tmpTouch.x;
        if (Math.abs(tmpX) > 20) {
          // 遷移条件
          if (tmpX > 0) {
            this.$emit('img-to-right');
          } else if (tmpX < 0) {
            this.$emit('img-to-left');
          }
        }

        if (this.touchMove.x === 0) {
          this.$emit('on-click-img');
          this.touches = [];
          return;
        }
        this.isMoveAnimation = true;
        this.touches = [];

        var self = this;
        setTimeout(function() {
          self.isMoveAnimation = false;
        }, 200);
      }
    }
  };

  Vue.component('tweet-modal-component', {
    data: function() {
      return {
        blobIsVisible: true,
        dispIndex: null
      };
    },
    props: ['status', 'index'],
    template: '#tweet-modal-component-template',
    components: {
      'action-btn-component': actionBtn,
      'local-img-list-component': imgListComponent
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
      getMediaData: function(index) {
        return this.status.extended_entities.media[index];
      },
      toggleBlob: function() {
        this.blobIsVisible = !this.blobIsVisible;
      },
      hideModal: function() {
        this.$emit('hide-modal');
      },
      nextImg: function() {
        if (this.nextImgIsExist === false) return;

        this.dispIndex++;
      },
      prevImg: function() {
        if (this.prevImgIsExist === false) return;

        this.dispIndex--;
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
      'list-item-component': listItemComponent
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

})();

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

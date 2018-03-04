<template>
  <ul class="m-tweetModal_imgList" :style="styleObj">
    <li v-for="image in images" class="m-tweetModal_imgWrapper">
      <img :src="image.media_url_https" class="m-tweetModal_img" @click.stop="onClickImg" @touchstart.stop.prevent="onTouchStart" @touchmove.stop.prevent="onTouchMove" @touchend.stop.prevent="onTouchEnd">
    </li>
  </ul>
</template>

<script>
export default {
  data: function() {
    return {
      touches: [],
      isMoveAnimation: false
    };
  },
  props: ['images', 'dispIndex'],
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
</script>

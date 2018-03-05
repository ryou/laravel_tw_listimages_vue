const Utils = require('../../../../libs/Utils');

const STATE = {
  NORMAL: 0,
  MOVE: 1,
  ANIMATE: 2,
};

const MOVE_DIR = {
  VERTICAL: 0,
  HORIZONTAL: 1,
};

export default {
  data: function() {
    return {
      touchStart: {
        x: 0,
        y: 0,
      },
      currentTouch: {
        x: 0,
        y: 0,
      },

      state: STATE.NORMAL,

      touches: [],

      // horizontal/vertical
      moveDir: null,

      isMoveAnimation: false
    };
  },
  props: ['images', 'dispIndex'],
  computed: {
    styleObj() {
      const style = {};

      const base = {
        x: -1 * this.dispIndex * window.innerWidth,
        y: 0,
      };
      const add = {
        x: 0,
        y: 0,
      };

      if (this.moveDir === MOVE_DIR.VERTICAL) {
        add.y = this.touchVector.y;
      } else if (this.moveDir === MOVE_DIR.HORIZONTAL) {
        add.x = this.touchVector.x;
      }

      style.transform = `translate(${base.x + add.x}px, ${base.y + add.y}px)`;

      if (this.isMoveAnimation) {
        style.transition = '.2s';
      }

      return style;
    },
    touchVector() {
      return {
        x: this.currentTouch.x - this.touchStart.x,
        y: this.currentTouch.y - this.touchStart.y,
      };
    },
    touchMove: function() {
      if (this.touches.length <= 0) {
        return {x: 0, y: 0};
      }

      return {
        x: this.touches[this.touches.length - 1].x - this.touches[0].x,
        y: this.touches[this.touches.length - 1].y - this.touches[0].y
      };
    },
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
      // TODO:アニメーション時の処理とか、ご動作起きないような例外処理を追加

      const touch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };

      this.touchStart = touch;
      this.currentTouch = touch;
    },
    onTouchMove: function(e) {
      this.currentTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };

      if (this.moveDir === null) {
        const direction = Utils.calcVectorDirection(this.touchVector);

        if (direction === 'up' || direction === 'down') {
          this.moveDir = MOVE_DIR.VERTICAL;
        } else {
          this.moveDir = MOVE_DIR.HORIZONTAL;
        }
      }
    },
    onTouchEnd: function(e) {
      const vectorLength = Math.sqrt(Math.pow(this.touchVector.x, 2) + Math.pow(this.touchVector.y, 2));

      if (vectorLength < 10) {
        this.$emit('on-click-img');
      }

      switch (this.moveDir) {
        case MOVE_DIR.VERTICAL:
          if (Math.abs(this.touchVector.y) > 50) {
            if (this.touchVector.y > 0) {
              this.$emit('img-to-down');
            } else {
              this.$emit('img-to-up');
            }
          }
          break;
        case MOVE_DIR.HORIZONTAL:
          if (Math.abs(this.touchVector.x) > 50) {
            if (this.touchVector.x > 0) {
              this.$emit('img-to-right');
            } else {
              this.$emit('img-to-left');
            }
          }
          break;
        default:
          break;
      }

      this.isMoveAnimation = true;
      this.moveDir = null;

      setTimeout(() => {
        this.isMoveAnimation = false;
      }, 200);
    }
  }
};

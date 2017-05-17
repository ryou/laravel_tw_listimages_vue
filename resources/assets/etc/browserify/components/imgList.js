var $ = require('jquery');
var ajaxBtn01Component = require('./ajaxBtn01');

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

module.exports = {
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
    'ajax-btn01-component': ajaxBtn01Component
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
};

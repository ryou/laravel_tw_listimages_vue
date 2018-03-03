import imgListComponent from './components/ImgList/template.vue';
import actionBtnComponent from './components/ActionBtn/template.vue';

export default {
  data() {
    return {
      blobIsVisible: true,
      dispIndex: null
    };
  },
  props: ['status', 'index'],
  components: {
    'local-img-list-component': imgListComponent,
    'action-btn-component': actionBtnComponent,
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
  },
};

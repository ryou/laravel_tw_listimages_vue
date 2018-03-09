import imgListComponent from './components/ImgList/template.vue';
import actionBtnComponent from './components/ActionBtn/template.vue';

export default {
  data() {
    return {
      blobIsVisible: true,
      dispIndex: null,
    };
  },
  props: ['status', 'index'],
  components: {
    'local-img-list-component': imgListComponent,
    'action-btn-component': actionBtnComponent,
  },
  computed: {
    img() {
      return this.status.extended_entities.media[this.dispIndex];
    },
    prevImgIsExist() {
      return (this.dispIndex > 0);
    },
    nextImgIsExist() {
      const imgNum = this.status.extended_entities.media.length;
      return (this.dispIndex < imgNum - 1);
    },
    dateStr() {
      const dateObj = new Date(this.status.created_at);
      return `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
    },
    retweetUrl() {
      return `/api/retweet/${this.status.id_str}`;
    },
    unretweetUrl() {
      return `/api/unretweet/${this.status.id_str}`;
    },
    createFavUrl() {
      return `/api/add_favorite/${this.status.id_str}`;
    },
    destroyFavUrl() {
      return `/api/delete_favorite/${this.status.id_str}`;
    },
  },
  created() {
    this.dispIndex = this.index;
  },
  methods: {
    getMediaData(index) {
      return this.status.extended_entities.media[index];
    },
    toggleBlob() {
      this.blobIsVisible = !this.blobIsVisible;
    },
    hideModal() {
      this.$emit('hide-modal');
    },
    nextImg() {
      if (this.nextImgIsExist === false) return;

      this.dispIndex += 1;
    },
    prevImg() {
      if (this.prevImgIsExist === false) return;

      this.dispIndex -= 1;
    },
  },
};

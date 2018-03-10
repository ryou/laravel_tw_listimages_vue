import Utils from '../libs/Utils';

const _ = require('lodash');
const axios = require('axios');

const LAYOUT_CODE = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export default {
  data() {
    return {
      drawer: true,
      layoutCode: '',
      lists: [],
      images: [],
      isLoading: {
        addImage: false,
      },
      isVisible: {
        tweetModal: false,
        fullLoader: true,
        loginModal: false,
        moreBtn: false,
        settingModal: false,
      },
      currentList: null,
      nextPage: 0,
      tweetModalProps: {
        status: null,
        index: 0,
      },
      includeRts: true,
    };
  },
  computed: {
    displayImages() {
      let { images } = this;
      if (this.includeRts === false) {
        images = images.filter(image => !image.status.retweet_user);
      }

      return images;
    },
    toolBarTitle() {
      if (this.currentList !== null) {
        return this.currentList.name;
      }

      return 'Twitter List Images Viewer';
    },
  },
  methods: {
    pushView(id, params = {}) {
      this.$store.commit('pushView', {
        id,
        params,
      });
      this.drawer = false;
    },
    callAPI(url, onSuccess) {
      const promise = axios.get(url, {
        withCredentials: true,
      })
        .then(response => response.data)
        .then(onSuccess)
        .catch((error) => {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              this.isVisible.loginModal = true;
              break;
            case 429:
              alert('利用制限にかかりました。15分以上時間を置いた後、再度実行してください。');
              this.isVisible.fullLoader = false;
              this.isLoading.addImage = false;
              break;
            default:
              alert(`${status}: ${data}`);
              break;
          }
        });

      return promise;
    },
    updateLayoutCode() {
      const w = window.innerWidth;
      if (w < 600) {
        this.layoutCode = LAYOUT_CODE.xs;
      } else if (w < 960) {
        this.layoutCode = LAYOUT_CODE.sm;
      } else if (w < 1264) {
        this.layoutCode = LAYOUT_CODE.md;
      } else if (w < 1904) {
        this.layoutCode = LAYOUT_CODE.lg;
      } else {
        this.layoutCode = LAYOUT_CODE.xl;
      }
    },
    initImages(list) {
      const id = list.id_str;

      this.isVisible.fullLoader = true;
      this.images = [];
      this.isVisible.moreBtn = false;
      this.currentList = list;
      if (this.layoutCode < LAYOUT_CODE.lg) {
        this.drawer = false;
      }

      this.callAPI(`/api/get_list_images/${id}/1`, (data) => {
        this.images = data;

        this.nextPage = 2;
        this.isVisible.fullLoader = false;
        this.isVisible.moreBtn = true;
      });
    },
    recentImages() {
      const id = this.currentList.id_str;

      this.isVisible.fullLoader = true;

      this.callAPI(`/api/get_list_images/${id}/1`, (data) => {
        const newImages = _.differenceWith(
          data,
          this.images,
          (a, b) => a.status.id_str === b.status.id_str
        );
        this.images = newImages.concat(this.images);

        this.isVisible.fullLoader = false;
      });
    },
    addImages() {
      const id = this.currentList.id_str;
      this.isLoading.addImage = true;

      this.callAPI(`/api/get_list_images/${id}/${this.nextPage}`, (data) => {
        if (data.length > 0) {
          const newImages = _.differenceWith(
            data,
            this.images,
            (a, b) => a.status.id_str === b.status.id_str
          );
          this.images = this.images.concat(newImages);
          this.nextPage += 1;
        } else {
          this.isVisible.moreBtn = false;
        }

        this.isLoading.addImage = false;
      });
    },
    showModal(image) {
      this.tweetModalProps.status = image.status;
      this.tweetModalProps.index = image.index;
      this.isVisible.tweetModal = true;
    },
    hideModal() {
      this.isVisible.tweetModal = false;
    },
    logout() {
      if (window.confirm('ログアウトしますか？')) {
        this.isVisible.fullLoader = true;

        this.callAPI('/api/logout', () => {
          window.location.reload(true);
        });
      }
    },
  },
  created() {
    window.addEventListener('popstate', () => {
      this.$store.commit('popView');
    });

    this.callAPI('/api/get_lists', (data) => {
      this.lists = data;

      this.isVisible.fullLoader = false;
    });

    this.updateLayoutCode();
  },
};

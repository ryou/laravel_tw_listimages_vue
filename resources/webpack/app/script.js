import Utils from '../libs/Utils';

const _ = require('lodash');

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

      Utils.fetchJSON(`/api/get_list_images/${id}/1`, {
        credentials: 'include',
      })
        .catch(() => {
          this.isVisible.loginModal = true;
        })
        .then((json) => {
          this.images = json;

          this.nextPage = 2;
          this.isVisible.fullLoader = false;
          this.isVisible.moreBtn = true;
        });
    },
    addImages() {
      const id = this.currentList.id_str;
      this.isLoading.addImage = true;

      Utils.fetchJSON(`/api/get_list_images/${id}/${this.nextPage}`, {
        credentials: 'include',
      })
        .catch(() => {
          this.isVisible.loginModal = true;
        })
        .then((json) => {
          if (json.length > 0) {
            const newImages = _.differenceWith(json, this.images, (a, b) => a.id_str === b.id_str);
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

        Utils.fetchJSON(`/api/logout`, {
          credentials: 'include',
        })
          .catch(() => {
          })
          .then((json) => {
            window.location.reload(true);
          });
      }
    },
  },
  created() {
    window.addEventListener('popstate', () => {
      this.$store.commit('popView');
    });

    Utils.fetchJSON('/api/get_lists', {
      credentials: 'include',
    })
      .catch(() => {
        this.isVisible.loginModal = true;
      })
      .then((json) => {
        this.lists = json;

        this.isVisible.fullLoader = false;
      });

    this.updateLayoutCode();
  },
};

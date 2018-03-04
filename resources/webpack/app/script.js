import Utils from '../libs/Utils';

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
      },
      currentList: null,
      nextPage: 0,
      tweetModalProps: {
        status: null,
        index: 0,
      },
    };
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
      } else if(w < 960) {
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
        this.images = this.images.concat(json);

        this.nextPage += 1;
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

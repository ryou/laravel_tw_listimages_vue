export default {
  data() {
    return {
      drawer: true,
      lists: [],
      images: [],
      isLoading: {
        addImage: false,
      },
      isVisible: {
        tweetModal: false,
        fullLoader: true,
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
    initImages(list) {
      const id = list.id_str;

      this.isVisible.fullLoader = true;
      this.images = [];
      this.currentList = list;
      this.drawer = false;

      fetch(`/api/get_list_images/${id}/1`, {
        credentials: 'include',
      }).then((response) => {
        return response.json();
      }).then((json) => {
        this.images = json;

        this.nextPage = 2;
        this.isVisible.fullLoader = false;
      });
    },
    addImages() {
      const id = this.currentList.id_str;
      this.isLoading.addImage = true;

      fetch(`/api/get_list_images/${id}/${this.nextPage}`, {
        credentials: 'include',
      }).then((response) => {
        return response.json();
      }).then((json) => {
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

    fetch('/api/get_lists', {
      credentials: 'include',
    }).then((response) => {
      return response.json();
    }).then((json) => {
      this.lists = json;

      this.isVisible.fullLoader = false;
    });
  },
};

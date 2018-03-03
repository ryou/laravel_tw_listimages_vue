export default {
  data() {
    return {
      drawer: null,
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
  },
  created() {
    this.$store.commit('initScore');

    window.addEventListener('popstate', () => {
      this.$store.commit('popView');
    });
  },
};

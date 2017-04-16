;(function() {
  Vue.component('nav-component', {
    data: function() {
      return {
      };
    },
    template: '#nav-component-template',
    methods: {
      showListModal: function() {
        this.$emit('show-list-modal');
      }
    }
  });
})();

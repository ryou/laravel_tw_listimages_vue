;(function() {
  Vue.component('list-modal-component', {
    data: function() {
      return {};
    },
    props: ['listData'],
    template: '#list-modal-component-template',
    methods: {
      hideModal: function() {
        this.$emit('hide-modal');
      },
      selectList: function(item) {
        this.$emit('select-list', item);
        this.$emit('hide-modal');
      }
    }
  });
})();

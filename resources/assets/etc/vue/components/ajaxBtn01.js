;(function() {
  Vue.component('ajax-btn01-component', {
    data: function() {
      return {
        isLoading: false
      };
    },
    props: ['url'],
    template: '#ajax-btn01-component-template',
    methods: {
      startAjax: function() {
        if (this.isLoading) return;
        this.isLoading = true;

        var self = this;
        $.getJSON(self.url, function(data) {
          self.$emit('success', data);
          self.isLoading = false;
        })
        .fail(function() {
          alert('データの読み込みに失敗しました。ページを再読込して下さい。');
        });

      }
    }
  });
})();

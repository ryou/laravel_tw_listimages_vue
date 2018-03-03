import Vue from 'vue';
import Vuetify from 'vuetify';
import store from './store';

import AppComponent from './app/template.vue';

Vue.use(Vuetify);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  render(h) {
    return h(AppComponent);
  },
});

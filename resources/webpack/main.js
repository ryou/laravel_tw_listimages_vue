import Vue from 'vue';
import Vuetify from 'vuetify';
import store from './store';

import AppComponent from './app/template.vue';
import TweetModalComponent from './components/TweetModal/template.vue';

Vue.component('tweet-modal-component', TweetModalComponent);

Vue.use(Vuetify);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  render(h) {
    return h(AppComponent);
  },
});

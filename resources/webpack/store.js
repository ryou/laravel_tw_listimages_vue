/* eslint-disable no-param-reassign */
/*
  ■ no-param-reassignを無効にする理由
  vuexでは、
  mutationFunc: (state) {
   ~
  }
  のように、mutationでstateを引数として渡され、公式のサンプルコードで
  引数stateを利用してstateを変更している。
  そのため、vuexの作法に則るためには引数の再代入を禁止するno-param-reassignを
  無効化する必要があるため。
*/

import Vue from 'vue';
import Vuex from 'vuex';
import createView from './views/createView';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    viewStack: [],
    currentView: {
      id: 'top',
      props: {},
      instance: createView('top'),
    },
    transitionName: 'fade',
    highScore: null,
  },
  getters: {
  },
  mutations: {
    pushView(state, params) {
      const { id, props } = params;

      if (id === state.currentView.id) return;

      state.transitionName = 'slideleft';

      const view = {
        id,
        props,
        instance: createView(id, props),
      };
      state.viewStack.push(state.currentView);
      state.currentView = view;

      window.history.pushState(null, null);
    },
    popView(state) {
      if (state.viewStack.length <= 0) return;
      const view = state.viewStack.pop();
      state.transitionName = 'slideright';
      state.currentView = view;
    },
    initScore(state) {
      const highScore = localStorage.getItem('highScore');

      if (highScore !== null) {
        state.highScore = highScore;
      }
    },
    sendScore(state, score) {
      if (state.highScore === null || score < state.highScore) {
        state.highScore = score;
        localStorage.setItem('highScore', score);
      }
    },
  },
});

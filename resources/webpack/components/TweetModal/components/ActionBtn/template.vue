<template>
  <button class="m-actionBtn" @click="changeState">
    <i
      class="material-icons"
      :class="classObj"
    >{{ icon }}</i><br>{{ text }}
  </button>
</template>

<script>
const $ = require('jquery');

export default {
  data() {
    return {
      isActive: null,
    };
  },
  props: ['activateUrl', 'deactivateUrl', 'icon', 'initialState', 'text', 'activeColor'],
  computed: {
    classObj() {
      const classArray = [];
      if (this.isActive) {
        classArray.push(`${this.activeColor}--text lighten-3`);
      }

      return classArray;
    },
  },
  created() {
    this.isActive = this.initialState;
  },
  methods: {
    changeState() {
      let url = '';
      if (this.isActive) {
        url = this.deactivateUrl;
      } else {
        url = this.activateUrl;
      }
      this.isActive = !this.isActive;

      $.ajax({
        url,
        type: 'POST',
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
      })
        .done(() => {
          //
        })
        .always(() => {
          //
        });
    },
  },
};
</script>

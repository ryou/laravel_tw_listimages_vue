<template>
  <button class="m-actionBtn" :class="classObj" @click="changeState"><v-icon dark>{{ icon }}</v-icon><br>{{ text }}</button>
</template>

<script>
  var $ = require('jquery');

  export default {
    data: function() {
      return {
        isActive: null
      };
    },
    props: ['activateUrl', 'deactivateUrl', 'icon', 'initialState', 'text'],
    computed: {
      classObj: function() {
        return {
          'is-active': this.isActive
        };
      }
    },
    created: function() {
      this.isActive = this.initialState;
    },
    methods: {
      changeState: function() {
        var url = '';
        if (this.isActive) {
          url = this.deactivateUrl;
        } else {
          url = this.activateUrl;
        }
        this.isActive = !this.isActive;

        $.ajax({
          url: url,
          type: 'POST',
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
        })
        .done(function() {
          //
        })
        .always(function() {
          //
        });
      }
    }
  };
</script>

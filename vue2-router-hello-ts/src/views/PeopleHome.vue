<template>
  <div class="topDiv">
    <div class="ui piled segment">
      <div class="ui red ribbon label">
        People
      </div>

      <transition name="faded-slide">
        <router-view/>
      </transition>
    </div>

    <div class="ui basic buttons">
      <router-link to="/people/list" class="item">
        <button class="ui button">List</button>
      </router-link>
      <router-link to="/people/item/40011/view" class="item">
        <button class="ui button">View 40011</button>
      </router-link>
      <router-link to="/people/item/40011/edit" class="item">
        <button class="ui button">Edit 40011</button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'PeopleHome',
  data(){
    return {
    };
  },
  methods: {
  },
});
</script>

<style scoped>
  div.topDiv {
    padding: 0 2em;
  }
  div.ui.ribbon.label {
    margin-bottom: 1em;
  }

  .faded-slide-enter-active,
  .faded-slide-leave-enter {
    transform: translateX(0);
    transition: all .15s ease-in;
  }
  .faded-slide-enter,
  .faded-slide-leave-to {
    transform: translateX(30%);
    opacity: 0;
  }
</style>

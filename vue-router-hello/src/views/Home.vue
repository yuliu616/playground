<template>
  <div class="topDiv">
    <div class="ui message">
      <p>{{ message }}</p>
    </div>

    <div class="ui cards">

      <div class="card">  
        <div class="content">
          <CounterList />
        </div>
      </div>

    </div>

    <div class="ui list" style="margin-top: 3em;">

      <router-link to="/" class="item">
        <i class="right triangle icon"></i>
        <div class="content">
          <div class="header">Home</div>
          <div class="description">
            Home page of this site/app.
            </div>
        </div>
      </router-link>

      <router-link to="/about" class="item">
        <i class="right triangle icon"></i>
        <div class="content">
          <div class="header">About</div>
          <div class="description">
            Find out who we are and what we do.
          </div>
        </div>
      </router-link>
      
      <router-link to="/people" class="item">
        <i class="right triangle icon"></i>
        <div class="content">
          <div class="header">People</div>
          <div class="description">
            Entry point of People sub-system.
          </div>
        </div>
      </router-link>

    </div>

  </div>
</template>

<script>
import CounterList from '@/components/CounterList';

export default {
  name: 'Home',
  data() {
    return {
      message: 'Hello, my friend.'
    };
  },
  components: {
    CounterList
  },
}
</script>

<style scoped>
  div.topDiv {
    max-width: 50em;
    margin: auto;
  }

  div.ui.cards {
    padding: 0 2em;
  }
</style>

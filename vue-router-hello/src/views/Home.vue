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

    <div class="ui segment">
      <div class="ui compact basic menu">
        <div class="ui dropdown item">
          More
          <i class="dropdown icon"></i>
          <div class="menu">
            <div class="item" v-on:click="onTimeAskingButtonPressed()">
              What is the time ?
            </div>
            <div class="item">
              Nothing here
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ui basic modal WhatTimeIsIt">
      <div class="ui icon header">
        <i class="clock icon"></i>
        System Clock
      </div>
      <div class="content">
        <p>
          {{ currentTimeGreetingWord }},
          the time now is {{ currentTimeForReporting }}
        </p>
      </div>
      <div class="actions">
        <div class="ui green ok button inverted">
          <i class="check icon"></i>
          Good
        </div>
        <div class="ui blue basic cancel button inverted">
          <i class="close icon"></i>
          Ok
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import CounterList from '@/components/CounterList';

export default {
  name: 'Home',
  data() {
    return {
      message: 'Hello, my friend.',
      currentTimeGreetingWord: 'hi',
      currentTimeForReporting: 'n/a',
    };
  },
  mounted(){
    // semantic ui: init for dropdown
    window.$('.ui.dropdown').dropdown();
  },
  methods: {
    onTimeAskingButtonPressed(){
      let now = new Date();
      if (now.getHours() < 5 || now.getHours() > 17) {
        this.currentTimeGreetingWord = "good evening";
      } else if (now.getHours() >= 12 && now.getHours() <= 17) {
        this.currentTimeGreetingWord = "good afternoon";
      }  else {
        this.currentTimeGreetingWord = "good morning";
      }
      this.currentTimeForReporting = now.toDateString();
      
      // semantic ui: show model dialog
      window.$('.ui.basic.modal.WhatTimeIsIt').modal('show');
    },
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

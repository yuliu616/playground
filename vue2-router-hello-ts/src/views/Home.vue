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
      <a-dropdown>
        <a-menu slot="overlay" @click="moreSubItemPressed">
          <a-menu-item key="what-time">What is the time ?</a-menu-item>
          <a-menu-item key="nothing">Nothing here</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          More <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <a-modal v-model="whatTimeDialogVisible" 
    title="System Clock" :closable="false" :maskClosable="false"
    :cancel-button-props="{ props: { disabled: true } }"
    @ok="whatTimeDialogOkPressed">
      <p>
        {{ currentTimeGreetingWord }},
        the time now is {{ currentTimeForReporting }}
      </p>
    </a-modal>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CounterList from '@/components/CounterList.vue';

export default Vue.extend({
  name: 'Home',
  data(){
    return {
      message: 'Hello, my friend.',
      currentTimeGreetingWord: 'hi',
      currentTimeForReporting: 'n/a',
      whatTimeDialogVisible: false,
    };
  },
  methods: {
    moreSubItemPressed(clicked: {key: string}){
      if (clicked.key === 'what-time') {
        this.onTimeAskingButtonPressed();
      }
    },
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
      
      this.whatTimeDialogVisible = true;
    },
    whatTimeDialogOkPressed(){
      this.whatTimeDialogVisible = false;
    },
  },
  components: {
    CounterList,
  },
});
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

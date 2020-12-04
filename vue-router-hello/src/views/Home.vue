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

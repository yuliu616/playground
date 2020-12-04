<template>
  <div class="ui cards">

    <div class="card">  
      <div class="content">
        <div class="header">
          About Us
        </div>
        <div class="meta">
          {{ message }}
        </div>
        <div class="description">
          This is a hello world view.
          <Counter CounterColor="yellow" />
        </div>      
      </div>
    </div>

  </div>
</template>

<script>
import Counter from '@/components/Counter';

export default {
  data(){
    return {
      message: 'greeting at '+new Date().toISOString(),
    };
  },
  methods: {
  },
  components: {
    Counter,
  },
};
</script>

<style scoped>
  div.ui.cards {
    padding: 0 2em;
  }
</style>
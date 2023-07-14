<template>
  <div class="ui raised segment">
    <div class="ui red ribbon label">
      Total = {{ totalCount }}
    </div>
    <Counter CounterColor="red" 
      v-on:counterHit="onChildCounterClick" />
    <Counter CounterColor="violet" :step="2" 
      v-on:counterHit="onChildCounterClick" />
    <Counter CounterColor="orange" :step="10" 
      v-on:counterHit="onChildCounterClick" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Counter from '@/components/Counter.vue';

export default Vue.extend({
  name: 'CounterList',
  data(){
    return {
      totalCount: 0,
    };
  },
  methods: {
    onChildCounterClick: function(amount: number){
      this.totalCount += amount;
    },
  },
  components: {
    Counter,
  },
});
</script>
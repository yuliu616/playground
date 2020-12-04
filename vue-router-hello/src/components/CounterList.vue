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

<script>
import Counter from '@/components/Counter';

export default {
  name: 'CounterList',
  data() {
    return {
      totalCount: 0,
    };
  },
  methods: {
    onChildCounterClick: function(amount){
      this.totalCount += amount;
    },
  },
  components: {
    Counter,
  },
};
</script>
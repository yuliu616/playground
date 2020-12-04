<template>
  <div style="margin-top: 0.8em;">
    <button class='ui basic button' 
      v-bind:class="[CounterColor]"
      v-on:click="onCounterClicked()">
      Count: {{ count }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  data() {
    return {
      count: 0,
    };
  },
  props: {
    CounterColor: String,
    step: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    onCounterClicked: function(){
      console.log('counter color=', this.CounterColor);
      let amount = this.step;
      this.count += amount;
      this.$emit('counterHit', amount);
    },
  },
}
</script>

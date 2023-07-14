var vm = {
  data: {
    message: 'greeting at '+new Date().toISOString(),
  },
  methods: {
  },
};

function init(){
  new Vue({
    el: '#my-app',
    data: vm.data,
    methods: vm.methods,
  });
}

Vue.component('some-counter', {
  data: function () { // note that it is a function
    return {
      count: 0
    }
  },
  props: [ 'title' ],
  methods: {
    onClicked: function(){
      this.count++;
      this.$emit('counterAlert');
    }
  },
  template: `
    <button v-on:click="onClicked">
      {{ title }} : You clicked me {{ count }} times.
    </button>`,
});

Vue.component('some-parent', {
  data: function () { // note that it is a function
    return {
      c: 100
    }
  },
  methods: {
    onChildClickEvent: function(){
      this.c++;
    }
  },
  template: `
    <div>
      <div>c: {{ c }}</div>
      <some-counter class="ui basic red button" 
        :title="'a'"
        v-on:counterAlert="onChildClickEvent"></some-counter>
      <some-counter class="ui basic blue button" 
        :title="'b'"
        v-on:counterAlert="onChildClickEvent"></some-counter>
    </div>
  `,
});

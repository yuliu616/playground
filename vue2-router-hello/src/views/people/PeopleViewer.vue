<template>
  <div class="ui cards">
    <div class="card">

      <div class="content">
        <div class="header">
          {{ item.firstName }}
        </div>
        <div class="meta">
          People ({{ item.id }})
        </div>
        <div class="description">
          {{ item.firstName }} {{ item.lastName }}, 
          your best friend.
        </div>      
      </div>

      <div class="ui bottom attached button" 
        v-on:click="onCloseClicked()">
        <i class="close icon"></i>
        Close
      </div>

    </div>
  </div>
</template>

<script>
import * as toastr from 'toastr/build/toastr.min.js';

const peopleList = [
  {id:40010, firstName: 'Tony', lastName: 'Becker'},
  {id:40011, firstName: 'Bitty', lastName: 'Ford'},
  {id:40012, firstName: 'Ted', lastName: 'Wood'},
  {id:40013, firstName: 'Jason', lastName: 'Logan'},
];

export default {
  name: 'PeopleViewer',
  data() {
    return {
      item: {},
    };
  },
  methods: {
    onCloseClicked: function(){
      this.$router.push('../../list');
    },
  },
  beforeRouteEnter: function(from, to, next){
    if (!peopleList.some(it=>it.id==from.params.id)) {
      console.log('peopleViewer:beforeRouteEnter from=', 
        from, ' to=', to);
      toastr.error(`invalid people ID: [${from.params.id}]`,
        'invalid route');
      next(new Error(`target people not found (${from.params.id})`));
    } else {
      next();
    }
  },
  created: function(){
    this.item = peopleList.find(it=>it.id==this.$route.params.id);
  },
};
</script>

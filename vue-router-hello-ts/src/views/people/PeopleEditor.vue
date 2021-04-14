<template>
  <div class="ui cards">
    <div class="card">

    <div class="content">
      <form class="ui form">

        <div class="field">
          <label>ID</label>
          <input type="text" readonly
            v-model="item.id">
        </div>
        <div class="field">
          <label>First Name</label>
          <input type="text" placeholder="First Name"
            v-model="item.firstName">
        </div>
        <div class="field">
          <label>Last Name</label>
          <input type="text" placeholder="Last Name"
            v-model="item.lastName">
        </div>
        
      </form>    
    </div>
    <div class="ui two bottom attached buttons">
      <div class="ui primary button"
        v-on:click="onSaveClicked()">
        <i class="save icon"></i>
        Save
      </div>
      <div class="ui secondary button"
        v-on:click="onCloseClicked()">
        <i class="close icon"></i>
        Discard
      </div>
    </div>

  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const peopleList = [
  {id:40010, firstName: 'Tony', lastName: 'Becker'},
  {id:40011, firstName: 'Bitty', lastName: 'Ford'},
  {id:40012, firstName: 'Ted', lastName: 'Wood'},
  {id:40013, firstName: 'Jason', lastName: 'Logan'},
];

export default Vue.extend({
  name: 'PeopleEditor',
  data(){
    let item: any = {};
    return {
      item: item,
    };
  },
  methods: {
    onSaveClicked: function(){
      this.$notification.open({
        message: 'wow',
        description:
          'save clicked',
      });
    },
    onCloseClicked: function(){
      this.$router.push('../../list');
    },
  },
  created: function(){
    this.item = peopleList.find(it=>it.id==+this.$route.params.id);
  },
});
</script>

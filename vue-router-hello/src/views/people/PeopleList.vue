<template>
  <div>
    <div class="ui large header">People List</div>
    
    <table class="ui tablet striped stackable table">
      <thead>
        <tr>
          <th style="min-width: 7.2em;">Id</th>
          <th style="min-width: 7.2em;">First name</th>
          <th style="min-width: 7em;">Last name</th>
          <th style="min-width: 7em;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in peopleList" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.firstName }}</td>
          <td>{{ p.lastName }}</td>
          <td class="right aligned">
            <div class="ui two buttons">
              <div class="ui basic grey button"
                v-on:click="onViewClicked(p)">
                <i class="view icon"></i>
                View
              </div>
              <div class="ui violet basic button"
                v-on:click="onEditClicked(p)">
                <i class="edit icon"></i>
                Edit
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="ui action input">
      <input type="number" v-model="jumpToPeopleId"
        placeholder="For People ID ...">
      <button class="ui button"
        v-on:click="onJumpToPeopleClicked(jumpToPeopleId)">Open</button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PeopleList',
  data() {
    return {
      peopleList: [
        {id:40010, firstName: 'Tony', lastName: 'Becker'},
        {id:40011, firstName: 'Bitty', lastName: 'Ford'},
        {id:40012, firstName: 'Ted', lastName: 'Wood'},
        {id:40013, firstName: 'Jason', lastName: 'Logan'},
      ],
      jumpToPeopleId: 40010,
    };
  },
  methods: {
    onViewClicked: function(people){
      this.$router.push(`item/${people.id}/view`);
    },
    onEditClicked: function(people){
      this.$router.push(`item/${people.id}/edit`);
    },
    onJumpToPeopleClicked: function(peopleId){
      this.$router.push(`item/${peopleId}/view`);
    },
  },
};
</script>

<template>
  <main class="my antd-cards holder">
    <div class="my small card" v-for="it in peopleList">
      <a-card class="person-card"
        :title="('[Person] '+it.firstName)"
        :head-style="{ 
          backgroundColor: 'teal', 
          color: 'white',
        }"
      >
        <p>
          {{ it.firstName }} {{ it.lastName }}
          <a-tag :color="(it.gender=='MALE' ? 'cyan':'pink')">
            {{ it.gender }}
          </a-tag>
          <br>
          <span>{{ it.dateOfBirth }}</span>
          <a-tag color="black">{{ it.age }}</a-tag>
          <br>
          <a-tag color="darkgreen">{{ it.heightInCm }}</a-tag>
          <a-tag color="darkblue">{{ it.weightInKg }}</a-tag>
        </p>

        <template #actions>
          <div>
            <font-awesome-icon icon="pen-to-square" style="margin-left: 0.4em;" />
            EDIT
          </div>
          <div>
            <font-awesome-icon icon="xmark" style="margin-left: 0.4em;" />
            CLOSE
          </div>
          <div>
            <font-awesome-icon icon="list" style="margin-left: 0.4em;" />
            LIST
          </div>
        </template>
      </a-card>
    </div>
  </main>
</template>

<script lang="ts">
import { fetchPersonList, type Person } from '@/model/PersonData';
import {
  PlusCircleFilled, BarsOutlined, FireFilled,
} from '@ant-design/icons-vue/lib/icons';
import { ref } from 'vue';

export default {
  components: { PlusCircleFilled, BarsOutlined, FireFilled },
  data() {
    return {
      peopleList: <Person[]>[],
    };
  },
  mounted() {
    fetchPersonList({ offset: 0, limit: 16 }).then(list => {
      this.peopleList = list;
    });
  },
};
</script>

<style scoped>
.person-card span {
  margin-right: 1em;
  margin-bottom: 0.4em;
}
</style>
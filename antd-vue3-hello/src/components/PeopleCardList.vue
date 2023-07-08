<template>
  <div class="my cards holder">
    <div class="my small card" v-for="it in peopleList">
      <a-card class="person-card"
        :headStyle="{ 'background-color': 'teal', 'color': 'white' }"
        :title="('[Person] '+it.firstName)"
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
          <PlusCircleFilled />
          <FireFilled />
          <BarsOutlined />
        </template>
      </a-card>
    </div>
  </div>
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
    fetchPersonList().then(list => {
      this.peopleList = list;
    });
  },
};
</script>

<style scoped>
.person-card span {
  margin-right: 1rem;
  margin-bottom: 0.4rem;
}
</style>
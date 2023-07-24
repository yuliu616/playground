<template>
  <div class="w100">
    <a-menu mode="horizontal"
      :theme="(darkTheme ? 'dark':'light')"
    >
      <a-sub-menu>
        <template #title>View</template>
        <a-menu-item key="demo0" @click="(targetSection = 'demo0')">
          Nothing
        </a-menu-item>
        <a-menu-item key="demo1" @click="(targetSection = 'demo1')">
          Fetching Table
        </a-menu-item>
        <a-menu-item key="demo2" @click="(targetSection = 'demo2')">
          Card List
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    
    <div v-if="targetSection == 'demo0'">
      <a-alert class="my antd-alert" 
        show-icon type="info"
        :message="'This is an about page' + t1"></a-alert>
    </div>
    <div v-if="targetSection == 'demo1'">
      <FetchedTableDemo />
    </div>
    <div v-if="targetSection == 'demo2'">
      <PeopleCardList />
    </div>  

  </div>
</template>

<script lang="ts">
import FetchedTableDemo from '@/components/FetchedTableDemo.vue';
import PeopleCardList from '@/components/PeopleCardList.vue';
import { ref } from 'vue';

export default {
  components: {
    FetchedTableDemo,
    PeopleCardList,
  },
  computed: {
    darkTheme: ()=>!!(+import.meta.env.VITE_DarkTheme),
  },
  data(){
    return {
      targetSection: ref(''),
      t1: ref('T for tour'),
    };
  },
  setup(props, ctx) {
  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
  },
  beforeUnmount() {
  },
  unmounted() {
  },
};
</script>

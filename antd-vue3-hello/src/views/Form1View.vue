<template>
  <main class="my antd-cards holder">

    <transition name="slide-fade">
      <div class="my huge card" v-if="!submitted">
        This is a
        <FormOutlined />form
      </div>
    </transition>
    <transition name="slide-fade">
      <div class="my huge card" v-if="submitted">
        <a-alert class="my antd-alert"
          show-icon type="success"
          closable
          message="Form feedback"
          description="form posted !!"
        >
          <template #icon><UploadOutlined /></template>
        </a-alert>
      </div>
    </transition>

    <SurveyForm 
      @form-posted="onChildFormPosted"
      @form-cleared="onChildFormCleared"
    />
  </main>
</template>

<script lang="ts">
import SurveyForm from '@/components/SurveyForm.vue';
import { ref } from 'vue';

export default {
  components: {
    SurveyForm: SurveyForm,
  },
  data: ()=>({
    submitted: ref(false),
  }),
  methods: {
    onChildFormPosted(data?: any){
      console.log('Form1View onChildFormPosted:', data);
      this.submitted = true;
    },
    onChildFormCleared(){
      console.log('Form1View onChildFormCleared:');
      this.submitted = false;
    },
  },
};
</script>

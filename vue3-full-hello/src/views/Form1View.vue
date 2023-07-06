<template>
  <div>
    <h1>This is a form</h1>
    <SurveyForm 
      @form-posted="onChildFormPosted"
      @form-cleared="onChildFormCleared"
    />
  </div>
</template>

<script lang="ts">
import SurveyForm from '@/components/SurveyForm.vue';

export default {
  components: {
    SurveyForm: SurveyForm,
  },
  methods: {
    onChildFormPosted(data?: any){
      console.log('Form1View onChildFormPosted:', data);
    },
    onChildFormCleared(){
      console.log('Form1View onChildFormCleared:');
    },
  },
};
</script>

<template>
  <div>
    <h1 v-if="!submitted">
      This is a
      <FormOutlined />form
    </h1>
    <a-alert v-if="submitted"
      showIcon closable
      type="success"
      message="Form feedback"
      description="form posted !!"
    >
      <template #icon><UploadOutlined /></template>
    </a-alert>
    <SurveyForm 
      @form-posted="onChildFormPosted"
      @form-cleared="onChildFormCleared"
    />
  </div>
</template>

<script lang="ts">
import SurveyForm from '@/components/SurveyForm.vue';
import { ref } from 'vue';
import { 
  FormOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue';

export default {
  components: {
    SurveyForm: SurveyForm,
    FormOutlined,
    UploadOutlined,
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

<style scoped>
h1 { color: white; }
</style>

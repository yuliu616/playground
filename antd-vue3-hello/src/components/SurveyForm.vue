<template>
  <div class="my solo-card holder" style="max-width: 30rem;">
    <a-badge-ribbon text="Fill This">
      <a-card class="my solo-card">
        <template #title>
          Survey Form
        </template>
        <a-form @submit.prevent="onSubmission()"
          layout="horizontal"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
        >

          <a-form-item label="Name">
            <a-input v-model:value.trim="surveyForm.name"
              class="w100" allow-clear
              placeholder="eg. Jackson"
            />
          </a-form-item>
          <a-form-item label="Contact email">
            <a-input v-model:value.trim="surveyForm.email"
              class="w100" allow-clear type="email"
              placeholder="eg. someone@outlook.com"
            />
          </a-form-item>
          <a-form-item label="Age">
            <a-input-number v-model:value="surveyForm.age"
              class="my ant input-number" autofocus 
              :min="1" :max="120"
            />
          </a-form-item>
          <a-form-item label="Like Movie">
            <a-switch v-model:checked="surveyForm.isMovieFan"
              checked-children="Like"
              un-checked-children="Dislike"
            />
          </a-form-item>
          <a-form-item label="Last watching">
            <a-date-picker v-model:value="surveyForm.lastWatchedDate"
              class="w100" picker="date" allow-clear
              placeholder="Last time(day) watching a movie"
              valueFormat="YYYY-MM-DD"
              format="(dddd) D, MMMM YYYY"
              show-today
            />
          </a-form-item>
          <a-form-item label="Rating">
            <a-select v-model:value="surveyForm.rating"
              :options="RatingRankOptions"
              class="w100" allow-clear
              placeholder="rate from 1 to 5 star(s)">
            </a-select>
          </a-form-item>
          <a-form-item label="Comments">
            <a-textarea v-model:value="surveyForm.comments" 
              allow-clear :maxlength="120"
              :auto-size="{minRows: 4, maxRows: 8}"
            ></a-textarea>
          </a-form-item>
          <a-form-item class="button-bar" :wrapper-col="{ offset: 0 }">
            <a-badge :count="submitCounter">
              <a-button type="primary" html-type="submit">Post</a-button>
            </a-badge>
            <a-button ghost danger @click.prevent="clearForm()">clear</a-button>
          </a-form-item>

          <div class="NameShuffleFieldWrapper">
            <NameShuffleField v-model:person-name="surveyForm.name" />
          </div>

        </a-form>
      </a-card>
  </a-badge-ribbon>
  </div>
</template>

<script lang="ts">
import { RatingRank, survey_word_text_for } from '@/model/RatingRank';
import NameShuffleField from './NameShuffleField.vue';
import { ref } from 'vue';
import { MessageService } from '@/service/MessageService';

interface MovieSurvey {
  name: string;
  email: string;
  age: number;
  isMovieFan: boolean;
  lastWatchedDate: string|null;
  rating: RatingRank;
  comments: string;
}

enum SurveyFormEvent {
  FormPosted = 'FormPosted',
  FormCleared = 'FormCleared',
}
let eventEmitter = (event: SurveyFormEvent, data?: any)=>{};

export default {
  emits: Object.values(SurveyFormEvent),
  components: {
    NameShuffleField: NameShuffleField,
  },
  setup(props, ctx) {
    // capture the event emitter for later use.
    eventEmitter = (event, data)=>ctx.emit(event, data);
  },
  data(){
    return {
      surveyForm: <MovieSurvey>{
        // default values
        name: 'unknown hero',
        // lastWatchedDate: '2020-10-25',
      },
      RatingRankOptions: Object.values(RatingRank)
        .map(it=>({ 
          value: it,
          label: survey_word_text_for('word.enum.RatingRank.', it),
        })),
      submitCounter: ref(0),
    };
  },
  computed: {
    iMessageService: ()=>MessageService(),
  },
  methods: {
    onSubmission(){
      console.log('someone posting a form:', this.surveyForm);
      console.log('JSON.stringify(form):', 
        JSON.stringify(this.surveyForm, null, 2));
      eventEmitter(SurveyFormEvent.FormPosted, this.surveyForm);
      this.submitCounter++;
      this.iMessageService.good({
        message: 'Survey Form',
        description: 'form posted',
      });
    },
    clearForm(){
      this.surveyForm = <MovieSurvey>{};
      eventEmitter(SurveyFormEvent.FormCleared);
      this.submitCounter = 0;
      this.iMessageService.good({
        message: 'Survey Form',
        description: 'form cleared',
      });
    },
  },
};
</script>

<style scoped>
.button-bar button {
  margin-right: 0.4rem;
}

.NameShuffleFieldWrapper {
  margin-top: 0.5rem;
}
</style>
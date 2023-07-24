<template>
  <div class="my big card">
    <a-badge-ribbon text="Fill This">
      <a-card class="my solo-card"
        :head-style="{ 
          backgroundColor: 'crimson',
          color: 'white',
        }"
      >
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
              allow-clear
              placeholder="eg. Jackson"
            />
          </a-form-item>
          <a-form-item label="Contact email">
            <a-input v-model:value.trim="surveyForm.email"
              allow-clear type="email"
              placeholder="eg. someone@outlook.com"
            />
          </a-form-item>
          <a-form-item label="Age">
            <a-input-number v-model:value="surveyForm.age"
              class="my antd-input-number"
              allow-clear
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
              class="my antd-date-picker" picker="date" 
              :dropdownClassName="(darkTheme ? 'my antd-dropdown-menu-dark':'')"
              allow-clear
              input-read-only
              placeholder="Last time(day) watching a movie"
              valueFormat="YYYY-MM-DD"
              format="(dddd) D, MMMM YYYY"
              show-today
            />
          </a-form-item>
          <a-form-item label="Rating">
            <a-select v-model:value="surveyForm.rating"
              class="my antd-select"
              :dropdownClassName="(darkTheme ? 'my antd-dropdown-menu-dark':'')"
              :options="RatingRankOptions"
              allow-clear
              placeholder="rate from 1 to 5 star(s)">
            </a-select>
          </a-form-item>
          <a-form-item label="Comments">
            <a-textarea v-model:value="surveyForm.comments" 
              allow-clear :maxlength="120"
              :auto-size="{minRows: 4, maxRows: 8}"
            ></a-textarea>
          </a-form-item>
          <a-form-item class="my button-bar" :wrapper-col="{ offset: 0 }">
            <a-badge :count="submitCounter" style="margin-right: 0.8em;">
              <a-button class="my antd-btn"
                :ghost="darkTheme"
                type="primary" html-type="submit"
              >
                Post
              </a-button>
            </a-badge>
            <a-button class="my antd-btn"
              :ghost="darkTheme"
              danger
              @click.prevent="clearForm()"
            >
              clear
            </a-button>
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
  computed: {
    iMessageService: ()=>MessageService(),
    darkTheme: ()=>!!(+import.meta.env.VITE_DarkTheme),
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
.NameShuffleFieldWrapper {
  margin-top: 0.5em;
}
</style>
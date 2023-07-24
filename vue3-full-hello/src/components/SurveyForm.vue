<template>
  <form @submit.prevent="onSubmission()">
    <div class="FormPanel">

      <div class="field">
        <label>Name</label>
        <input type="text" class="w100" 
          placeholder="eg. Jackson"
          v-model.trim="surveyForm.name"

          @keyup.a="hi(1)" 
          @keyup.b="hi(2)" 
          @keyup.c.exact="hi(3)" 

          @keyup.ctrl.c.exact="hi(31)" 
          @keyup.alt.c="hi(32)" 
          @keyup.shift.c="hi(33)" 
          @keyup.meta.c="hi(34)" 

          @keydown.ctrl="hi(41)" 
          @keydown.alt="hi(42)" 
          @keydown.shift="hi(43)" 
          @keydown.meta="hi(44)" 

          @keyup.1="hi(5)" 
          @keyup.2="hi(6)" 
          @keyup.3="hi(7)" 

          @keyup.f1="hi(101)" 
          @keyup.f2="hi(102)" 
          
          @keyup.page-down="hi(51)" 
          @keyup.esc="hi(52)" 
          @keyup.space="hi(53)" 
          @keyup.delete="hi(54)" 
          @keyup.backspace="hi(55)" 
          @keydown.tab="hi(56)" 
          @keydown.caplock="hi(57)" 
        />
      </div>      
      <div class="field">
        <label>Contact email</label>
        <input type="email" class="w100" 
          placeholder="eg. someone@outlook.com"
          v-model.trim="surveyForm.email"

          @copy="hi(301)"
          @paste="hi(302)"
          @cut="hi(303)"
        />
      </div>
      <div class="field">
        <label>Age</label>
        <input type="number" class="w100" autofocus 
          v-model.number="surveyForm.age"
          min="1" max="120"
          @wheel="hi(999)"
        />
      </div>
      <div class="field w100">
        <label>Like Movie</label>
        <input type="checkbox"
          v-model="surveyForm.isMovieFan"
        />
      </div>
      <div class="field">
        <label>Last time watching a movie</label>
        <input type="date" class="w100"
          v-model="surveyForm.lastWatchedDate"
        />
      </div>
      <div class="field">
        <label>Rating</label>
        <select v-model.number="surveyForm.rating" style="margin-left: 1.2em;">
          <option disabled value="">rate from 1 to 5 star(s)</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
      <div class="field">
        <label>Comments</label>
        <textarea class="w100" 
          @click.left="hi(801)"
          @click.right="hi(802)"
          @click.middle="hi(803)"
          v-model="surveyForm.comments"
        ></textarea>
      </div>
      <div class="field">
        <div>
          <input type="submit" />
          <button @click.prevent="clearForm()">clear</button>
        </div>
      </div>

      <div style="margin-top: 0.5em;">
        <NameShuffleField v-model:person-name="surveyForm.name" />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import NameShuffleField from './NameShuffleField.vue';

// recommend to define an interface 
// for the form model
interface MovieSurvey {
  name: string;
  email: string;
  age: number;
  isMovieFan: boolean;
  lastWatchedDate: Date;
  rating: number;
  comments: string;
}

// define a enum for event that this component emit
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
      },
    };
  },
  methods: {
    hi(num: number){
      console.log(num);
    },
    onSubmission(){
      console.log('someone posting a form:', this.surveyForm);
      console.log('JSON.stringify(form):', 
        JSON.stringify(this.surveyForm, null, 2));
      eventEmitter(SurveyFormEvent.FormPosted, this.surveyForm);
    },
    clearForm(){
      this.surveyForm = <MovieSurvey>{};
      eventEmitter(SurveyFormEvent.FormCleared);
    },
  },
};
</script>

<style scoped>
.FormPanel {
  padding: 1.8em;
  max-width: 30em;
  margin: 1em auto;

  border: 1px solid white;
  border-radius: 1.6em;
  background-color: rgb(46, 46, 46);
}

div.field {
  margin-top: 0.4em;
}
div.field input {
  color: white;
  background-color: rgb(0, 53, 30);
}
div.field textarea {
  color: white;
  background-color: rgb(0, 53, 30);
  min-height: 6em;
}

.FormPanel input[type=submit] {
  padding: 0.4em 1.6em;
  border-radius: 0.4em;
}

.FormPanel button {
  padding: 0.4em 1.6em;
  border-radius: 0.4em;
  margin-left: 0.4em;
}

.w100 {
  width: 100%;
}
</style>
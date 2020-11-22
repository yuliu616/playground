import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FeedbackMessage, FeedbackService } from 'src/app/service/FeedbackService';
import { BackendApiService } from 'src/app/service/BackendApiService';
import { PeopleModelMeta, IPeople } from 'src/model/IPeople.model';
import { DateUtil } from 'src/util/DateUtil';
import { CollectionUtil } from 'src/util/CollectionUtil';
import { GenderEnum } from 'src/model/Gender.enum';

@Component({
  selector: 'app-people-creator',
  templateUrl: './people-creator.component.html',
})
export class PeopleCreatorComponent implements OnInit {

  genderList: string[] = GenderEnum.valuesStr;

  people: IPeople = {
    date_of_birth: DateUtil.todayIso(true),
  };

  feedback: FeedbackMessage = null;
  fieldsWithError = [];
  reasonOfCantSubmit: string = null;
  isSubmitted = false;

  isViewReady = true;

  constructor(
    private router: Router,
    private backendApiService: BackendApiService,
    private feedbackService: FeedbackService,
  ) {
  }

  async ngOnInit() {
    // await PromiseUtil.timedTask(3000,()=>{});
    this.isViewReady = true;
  }

  async submitCreation(){

    //validation
    let errorFields: string[] = [];
    let requiredFields: string[] = CollectionUtil.listFieldNameWhere(
      PeopleModelMeta.fields, fd=>fd.required||false);
    for (let f of requiredFields) {
      let v = this.people[f];
      if (!v) {
        errorFields.push(f);
      }
    }
    if (this.people.weight_in_kg) {
      if (this.people.weight_in_kg <= 0.0){
        errorFields.push("weight_in_kg");
      }
    }
    if (this.people.date_of_birth && moment(this.people.date_of_birth).isAfter(moment())){
      errorFields.push("date_of_birth");
    }
    this.fieldsWithError = errorFields;
    if (this.fieldsWithError.length > 0) {
      this.reasonOfCantSubmit = 
        "SomeFieldValueWontGood";
      return;
    } else {
      this.reasonOfCantSubmit = null;
    }

    // validation pass, post to server.
    this.isSubmitted = true;
    // await PromiseUtil.timedTask(3000, ()=>{});
    this.backendApiService.People.post(this.people)
    .then(reloaded=>{
      this.feedback = this.feedbackService.good(
        "RecordPersistedWithId" + reloaded.id,
        "view.PeopleView",
      );
    }).catch(err=>{
      this.isSubmitted = false; //undo
      this.feedback = this.feedbackService.bad( 
          "ErrorCreatingRecordWithType", 
          "word.People"
      );
      if (this.feedback.causeLocation) {
        this.fieldsWithError = [ this.feedback.causeLocation ];
      }
    });
  }

  cancelCreation(){
    this.router.navigate([ '/home' ]);
  }

}

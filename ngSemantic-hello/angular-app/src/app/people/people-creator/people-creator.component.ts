import { Component, OnInit } from '@angular/core';
import { People } from 'src/model/People.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-people-creator',
  templateUrl: './people-creator.component.html',
})
export class PeopleCreatorComponent implements OnInit {

  genderList: string[] = [
    'MALE', 'FEMALE',
  ];

  people: People = {
    date_of_birth: moment().local()
      .set('millisecond',0).set('second',0).set('minute',0).set('hour',0)
      .toDate()
  };

  feedback: FeedbackMessage = null;
  fieldsWithError = [];
  reasonOfCantSubmit: string = null;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  ngOnInit() {
  }

  submitPeopleCreation(){

    //validation
    let requiredFields = [
      "first_name",
      "last_name",
      "gender",
    ];

    let errorFields: string[] = [];
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
    if (this.people.date_of_birth) {
      let dob = moment(this.people.date_of_birth);
      if (dob.isAfter(moment())){
        errorFields.push("date_of_birth");
      }
    }
    this.fieldsWithError = errorFields;
    if (this.fieldsWithError.length > 0) {
      this.reasonOfCantSubmit = "some field value won't look good yet."
      return;
    } else {
      this.reasonOfCantSubmit = null;
    }

    // validation pass, post to server.
    this.httpClient.post<People>('/api/1.0/People', this.people)
    .toPromise().then(reloaded=>{
      console.log('ok feedback: ', reloaded);
      this.feedback = {
        type: "success",
        header: "People created !!",
        message: `The record is persisted in our database, with ID ${reloaded.id}.`,
      }
    }).catch(err=>{
      console.log('error feedback: ', err);
      this.feedback = {
        type: "error",
        header: "Oops",
        message: `Well, something went bad.`,
      }
    });
  }

  cancelCreation(){
    this.router.navigate([ '/people' ]);
  }

}

export class FeedbackMessage {

  type: "success" | "error";
  header: string;
  message: string;

}

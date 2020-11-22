import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { People } from 'src/model/People.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-people-editor',
  templateUrl: './people-editor.component.html',
})
export class PeopleEditorComponent implements OnInit {

  genderList: string[] = [
    'MALE', 'FEMALE',
  ];

  people: People;

  feedback: FeedbackMessage = null;
  fieldsWithError = [];

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    let peopleId = this.route.snapshot.paramMap.get('id');
    this.httpClient.get<People>(`/api/1.0/People/${peopleId}`).toPromise().then(p=>{
      this.people = p;
      // convert date field to JsDate
      if (this.people.date_of_birth) {
        this.people.date_of_birth = moment(this.people.date_of_birth).toDate();
      }
    });
  }

  submitPeopleUpdate(){
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
      return;
    }

    // validation pass, post to server.
    this.httpClient.put<People>(`/api/1.0/People/${this.people.id}`, this.people)
    .toPromise().then(reloaded=>{
      console.log('ok feedback: ', reloaded);
      this.feedback = {
        type: "success",
        header: "People updated !!",
        message: `The record is updated in our database, version is now ${reloaded.version}.`,
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

  cancelUpdate(){
    this.router.navigate([ '/people' ]);
  }

}

export class FeedbackMessage {

  type: "success" | "error";
  header: string;
  message: string;

}

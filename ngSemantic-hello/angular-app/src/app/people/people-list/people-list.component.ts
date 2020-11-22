import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { People } from 'src/model/People.model';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
})
export class PeopleListComponent implements OnInit {

  peopleList: People[];

  constructor(
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.httpClient.get<People[]>('/api/1.0/People')
    .toPromise().then(peopleList=>{
      this.peopleList = peopleList;
    });
  }

}

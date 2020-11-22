import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { People } from 'src/model/People.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-people-viewer',
  templateUrl: './people-viewer.component.html',
})
export class PeopleViewerComponent implements OnInit {

  people: People;

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    let peopleId = this.route.snapshot.paramMap.get('id');
    this.httpClient.get<People>(`/api/1.0/People/${peopleId}`).toPromise().then(p=>{
      this.people = p;
    });
  }

  editThisPerson(){
    this.router.navigate([ 'people', this.people.id, 'edit' ]);
  }

  closeView(){
    this.router.navigate([ 'people' ]);
  }

}

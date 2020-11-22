import { Component, OnInit, Input } from '@angular/core';
import { People } from 'src/model/People.model';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent implements OnInit {

  @Input()
  people: People;

  constructor() { }

  ngOnInit() {
  }

}

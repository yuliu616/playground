import { Component } from '@angular/core';
import { ClassicAlertService } from './classic-alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { People } from '../model/People.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = `First page of [${environment.appTitle}]`;
  hero: People = { id: 101, first_name: 'Iron', last_name: 'Man' };
  draftText = '(type something here)';

  constructor(
    private classicAlertService: ClassicAlertService,
    private httpClient: HttpClient,
  ){}
  
  okPressed(){
    this.title = 'page is now '+new Date().toISOString();
  }

  sayIt(){
    this.classicAlertService.addMessage(this.draftText);
  }

  ask(){
    this.httpClient.get<People>('/api/1.0/People/1').toPromise().then(p=>{
      this.hero.first_name = p.first_name;
      this.hero.last_name = p.last_name;
    });
  }
}

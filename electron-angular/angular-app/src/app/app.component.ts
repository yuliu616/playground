import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pathSegmentList: Segment[];
  isWaitingBackend = false; //TODO: toggle this by BackendApiService
  isViewReady = false;

  constructor(
    protected router: Router,
  ) {
    this.router.events.subscribe(event=>{
      if (event instanceof NavigationEnd) {
        this.onRoutingEvent(event);
      }
    });
  }

  appTitle(): string {
    return environment.appTitle;
  }

  async ngOnInit(){
    // await PromiseUtil.timedTask(1200,()=>{});
    
    // bootstrap
    this.isViewReady = true;
  }

  onRoutingEvent(event: NavigationEnd){
    // decode router current location path into array of segment.
    if (event.url == "/home") {
      this.pathSegmentList = [];
    } else {
      let filtered: Segment[] = [];
      let pathSoFar: string = null;
      for (let s of event.url.split("/")){
        if (s == "") {
          // nothing
        } else if (!pathSoFar) {
          pathSoFar = "/"+s;
        } else {
          pathSoFar = pathSoFar + "/" + s;
        }
  
        if (s == "" || s == "0" || +s){
          // dont add.
          continue;
        }
        
        filtered.push({
          node: s,
          fullPath: pathSoFar,
          isLast: false,
        });
        // console.log("node <<", filtered[filtered.length-1]);
      }
      if (filtered.length > 0) {
        filtered[filtered.length-1].isLast = true;
      }
      this.pathSegmentList = filtered;  
    }
  }

}

interface Segment {
  node: string,
  fullPath: string,
  isLast: boolean,
}
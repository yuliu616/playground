import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { 
  }

  async ngOnInit() {
    // await PromiseUtil.timedTask(3000,()=>{});
  }

  nav(path: string){
    this.router.navigateByUrl(path);
  }
  
}

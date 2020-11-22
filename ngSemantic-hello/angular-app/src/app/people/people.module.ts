import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';
import { PeopleHomeComponent } from './people-home/people-home.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleViewerComponent } from './people-viewer/people-viewer.component';
import { PeopleCreatorComponent } from './people-creator/people-creator.component';
import { PeopleEditorComponent } from './people-editor/people-editor.component';
import { PeopleRoutingModule } from './people-routing.module';

@NgModule({
  declarations: [
    // PeopleHomeComponent, 
    // PeopleListComponent, 
    // PeopleViewerComponent, 
    // PeopleCreatorComponent, 
    // PeopleEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SuiModule,
    PeopleRoutingModule,
  ]
})
export class PeopleModule { }

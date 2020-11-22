import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PeopleHomeComponent } from './people-home/people-home.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleViewerComponent } from './people-viewer/people-viewer.component';
import { PeopleEditorComponent } from './people-editor/people-editor.component';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { PeopleCreatorComponent } from './people-creator/people-creator.component';

const routes: Routes = [
  {
    path: 'people',
    component: PeopleHomeComponent,
    children: [
      { path: 'list', component: PeopleListComponent },
      { path: 'new', component: PeopleCreatorComponent },
      { path: ':id', component: PeopleViewerComponent },
      { path: ':id/edit', component: PeopleEditorComponent },
    ]
  },
];

@NgModule({
  declarations: [
    PeopleHomeComponent,
    PeopleListComponent,
    PeopleViewerComponent,
    PeopleEditorComponent,
    PeopleCreatorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SuiModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class PeopleRoutingModule { }

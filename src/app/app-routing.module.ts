import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { PrintPreviewComponent } from './diagram-editor/print-preview/print-preview.component';
import { EditorComponent } from './editor-component/editor.component';

const routes:Routes = [
  {
    path:'',redirectTo:'editor',pathMatch:'full'
  },
  {
    path:'editor',component:EditorComponent
  },
  {
    path:'preview', component:PrintPreviewComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { 

  
}

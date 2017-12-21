import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { AppComponent } from './app.component';
import { DiagramEditorComponent } from './diagram-editor/diagram-editor.component';
import { PrintPreviewComponent } from './diagram-editor/print-preview/print-preview.component';
import { Tabs } from './tabs/tabs';
import { AppFormEditor } from './diagram-editor/form-component'
import { EditorComponent} from './editor-component/editor.component'

import { ExampleService } from './app-service/app.component.service';
import { AppRoutingModule } from './/app-routing.module';




@NgModule({
  declarations: [
    AppComponent,
    DiagramEditorComponent,
    PrintPreviewComponent,
    Tabs,
    AppFormEditor,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [ExampleService],
  bootstrap: [AppComponent]
})
export class AppModule { }

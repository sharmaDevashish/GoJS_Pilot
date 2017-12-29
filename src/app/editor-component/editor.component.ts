import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as go from 'gojs';

import { ExampleService } from '../app-service/app.component.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Tabs } from '../tabs/tabs'

@Component({
  selector: 'app-root',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  
})


export class EditorComponent implements OnInit{
  title = 'FBD Pilot';
  message:any;
  dataMethod
  model = go.Model.fromJson({ "class": "go.GraphLinksModel()",
  "nodeCategoryProperty": "type",
  "linkFromPortIdProperty": "frompid",
  "linkToPortIdProperty": "topid",
  "nodeDataArray": [

  ],
  "linkDataArray": [
  ]
});

  @ViewChild('text')
  private textField: ElementRef;

  data: any;
  node: go.Node;


  showDetails(node: go.Node | null) {
    this.node = node;
    if (node) {
      // copy the editable properties into a separate Object
      this.data = {
        text: node.data.text,
        color: node.data.color
      };
    } else {
      this.data = null;
    }
    this._exampleService.choosenNode(this.node);
  }

  onCommitDetails() {
    if (this.node) {
      const model = this.node.diagram.model;
      // copy the edited properties back into the node's model data,
      // all within a transaction
      model.startTransaction();
      model.setDataProperty(this.node.data, "text", this.data.text);
      model.setDataProperty(this.node.data, "color", this.data.color);
      model.commitTransaction("modified properties");
    }
  }

  onCancelChanges() {
    // wipe out anything the user may have entered
    this.showDetails(this.node);
  }

  onModelChanged(c: go.ChangedEvent) {
    // who knows what might have changed in the selected node and data?
    this.showDetails(this.node);
    this._exampleService.dataMethod(this.model);
  }

  ngOnInit(){

    
    
    

        
  }

  constructor(private _exampleService: ExampleService) {
      
  }
}

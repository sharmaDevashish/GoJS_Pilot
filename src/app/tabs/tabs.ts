import {Component,OnInit,Input,ViewChild,ElementRef } from '@angular/core';
import * as go from 'gojs';

import { ExampleService } from '../app-service/app.component.service';

@Component({
  selector: 'ngbd-tabset-basic',
  templateUrl: 'tabs.html'
})
export class Tabs implements OnInit  {

  @Input() data: any;
  @Input() node:go.Node;
  nodeData:any;
  message:string;
  private treePalette: go.Palette = new go.Palette();
  
  @ViewChild('treeViewPalette')
  private treePaletteRef: ElementRef;
  
  constructor(private _exampleService: ExampleService){
    this._exampleService.dataMethod$.subscribe((data)=>{
      this.data = data;
      console.log(this.data)});
    
    this._exampleService.choosenNode$.subscribe((node)=>{
      this.node = node;
      console.log(this.node)});
      this.showDetails(this.node);
    }

  showDetails(node: go.Node | null) {
    this.node = node;
    if (node) {
      // copy the editable properties into a separate Object
      this.nodeData = {
        text: node.data.text,
        color: node.data.color
      };
    } else {
      this.data = null;
    }
    this._exampleService.choosenNode(this.node);
  }

  onCommitDetails() {
    console.log("in");
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

  

  ngOnInit() {}
  

  
 }

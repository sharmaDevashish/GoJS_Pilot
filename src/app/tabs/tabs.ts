import {Component,OnInit,Input } from '@angular/core';
import * as go from 'gojs';

import { ExampleService } from '../app-service/app.component.service';

@Component({
  selector: 'ngbd-tabset-basic',
  templateUrl: 'tabs.html'
})
export class Tabs implements OnInit  {

  @Input() data: Array<any>;
  @Input() node:go.Node;
  nodeData:any;
  message:string;
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

  ngOnInit() {
    
  }

  
 }
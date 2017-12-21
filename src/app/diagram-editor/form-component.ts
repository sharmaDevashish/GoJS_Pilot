import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import * as go from 'gojs';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-component.html',
  styleUrls: ['./form-component.css']
})
export class AppFormEditor implements OnInit,OnChanges {

  @Input() map1:any;

  inputArray = [
    { text: "Alpha", color: "lightblue" },
    { text: "Beta", color: "orange" },
    { text: "Gamma", color: "lightgreen" },
    { text: "Delta", color: "pink" },
    { text: "Epsilon", color: "yellow" }
  ];

  private palette1: go.Palette = new go.Palette();

  @ViewChild('paletteDiv1')
  private paletteRef: ElementRef;

  constructor() {}

  ngOnInit() {
    this.palette1.div = this.paletteRef.nativeElement;
  }
  
  ngOnChanges(){
    
    const ggm = go.GraphObject.make;
    this.palette1= new  go.Palette();
    
    this.palette1.nodeTemplate =
    ggm(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        ggm(go.Shape,
          {
            fill: "white", strokeWidth: 0,
            portId: "", cursor: "pointer",
            // allow many kinds of links
            fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true
          },
          new go.Binding("fill", "color")),
        ggm(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay())
      ); 

    var _tempnodeDataArray = [];
                  for(var i=0;i<this.inputArray.length;i++){
                      _tempnodeDataArray[i] = {
                                              "text":(this.inputArray[i].text),
                                              "color":(this.inputArray[i].color),
                                             
                      };   
                  }
                  
                  this.palette1.model.nodeDataArray = _tempnodeDataArray;
                  _tempnodeDataArray = [];
   }
}

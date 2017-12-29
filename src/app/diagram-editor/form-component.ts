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

  /*inputArray = [
    { text: "Alpha", color: "lightblue" },
    { text: "Beta", color: "orange" },
    { text: "Gamma", color: "lightgreen" },
    { text: "Delta", color: "pink" },
    { text: "Epsilon", color: "yellow" },
    { text: "Controller1", color:"#18499e"},
    { text: "Device2", color:"#18499e"}
  ];*/

  inputArray = [
    { category:"Device1",
      Name:"Controller1",
      Type:"PID",
      Description:"Device1 Desc",
      Iports:["PV","SV","PB","Ti","Td"],
      Oports:["MV"],
      color: "#18499e"
    },
    { category:"Device2",
      Name:"Device2",
      Type:"Type2",
      Description:"Device2 Desc",
      Iports:["A1","A2"],
      Oports:["B1"],
      color: "#18499e"
    }]

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
          new go.Binding("text", "name").makeTwoWay())
      ); 

      /*this.palette1.nodeTemplate =
                  ggm(go.Node, "Vertical",
                    {locationObjectName: "TB"},
                      ggm(go.Panel, "Table",
                      {width: 220, height: 30},
                          ggm(go.RowColumnDefinition,
                              { column: 0, alignment: go.Spot.Left}),
                          ggm(go.RowColumnDefinition,
                              { column: 2, alignment: go.Spot.Right }),
                    ggm(go.Shape,{fill: "#F7F7F7",stroke:"#F7F7F7",width: 220, height: 50}),
                    ggm(go.TextBlock, { name: "TB1",font: "12px Noto Sans,Regular",alignment: go.Spot.Center},
                    new go.Binding("text", "name")),
                    )
                  );  */

    var _tempnodeDataArray = [];
                  for(var i=0;i<this.inputArray.length;i++){
                      _tempnodeDataArray[i] = {
                        "type":(this.inputArray[i].Type),
                        "name":(this.inputArray[i].Name),
                      };   
                  }
                  
                  this.palette1.model.nodeDataArray = _tempnodeDataArray;
                  _tempnodeDataArray = [];
   }
}

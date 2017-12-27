import {Component,OnInit,Input,ViewChild,ElementRef } from '@angular/core';
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

      /*const $ = go.GraphObject.make;

      this.treePalette.nodeTemplate =
                  $(go.Node,
                  { selectionAdorned: false }, 
                  new go.Binding("copyable", "isTreeLeaf"),
                  $("TreeExpanderButton",
                  {
                  width: 14,
                  "ButtonIcon.stroke": "blue",
                  "ButtonBorder.fill": "yellow"
                  }),
                  $(go.Panel, "Horizontal",
                  { position: new go.Point(16, 0) },
                  new go.Binding("background", "isSelected", function (s) { return (s ? "lightblue" : "white"); }).ofObject(""),
                  $(go.Picture,
                  {
                  width: 14, height: 14,
                  margin: new go.Margin(0, 4, 0, 0),
                  imageStretch: go.GraphObject.Uniform,
                  //source: imageUrl
                  }),
                  $(go.TextBlock,
                  new go.Binding("text", "name"))
                  ) // end Horizontal Panel
                  ); // end Node

                  this.treePalette.linkTemplate = $(go.Link);

                  this.treePalette.layout =
                  $(go.TreeLayout,
                  {
                  alignment: go.TreeLayout.AlignmentStart,
                  angle: 0,
                  compaction: go.TreeLayout.CompactionNone,
                  layerSpacing: 16,
                  layerSpacingParentOverlap: 1,
                  nodeIndent: 2,
                  nodeIndentPastParent: 0.88,
                  nodeSpacing: 0,
                  setsPortSpot: false,
                  setsChildPortSpot: false
                  });
                  var paletteList = new Array(
                    { 'key' : 'I4','parent' : '2', 'name' : 'pippo', 'isTreeLeaf': true},
                    { 'key' : 'I5','parent' : '2', 'name' : 'pippo2', 'isTreeLeaf': true},
                    { 'key' : 'I6','parent' : '2', 'name' : 'rrrrr', 'isTreeLeaf': true},
                    { 'key' : 'I7','parent' : '2', 'name' : 'oiuy', 'isTreeLeaf': true},
                    { 'key' : 'I8','parent' : '2', 'name' : 'pippopopo', 'isTreeLeaf': true},
                    { 'key' : '2' ,'parent' : '' , 'name' : 'Test', 'isTreeLeaf': false})

                  this.treePalette.model = new go.TreeModel(paletteList);*/
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
    //this.treePalette.div = this.treePaletteRef.nativeElement;
  }

  
 }

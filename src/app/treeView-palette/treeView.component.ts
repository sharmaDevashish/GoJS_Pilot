import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'tree-view',
  templateUrl: './treeView.component.html',
  styleUrls: ['./treeView.component.css'],
  
})

export class TreeViewComponent implements OnInit{
    
    private treePalette: go.Palette = new go.Palette();
    
    @ViewChild('treeViewPalette')
    private treePaletteRef: ElementRef;

    inputArray = [
      { key:2,
        category:"Device1",
        Name:"Controller1",
        Type:"PID",
        Description:"Device1 Desc",
        parent:1,
        Iports:["PV","SV","PB","Ti","Td"],
        Oports:["MV"],
        color: "#18499e"
      },
      { key:1,
        category:"Device2",
        Name:"Device2",
        Type:"Type2",
        Description:"Device2 Desc",
        Iports:["A1","A2"],
        Oports:["B1"],
        color: "#18499e"
      }];
    
    constructor(){}
  
    ngOnInit() {
      this.treePalette.div = this.treePaletteRef.nativeElement;

      const $ = go.GraphObject.make;

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

          
  
        this.treePalette.nodeTemplate =
                    $(go.Node,
                    { selectionAdorned: false,
                       click: (e, node) => {
                        var cmd = this.treePalette.commandHandler;
                        if (node.isTreeExpanded) {
                          cmd.collapseTree(node);
                        }else{
                          cmd.expandTree(node);
                        }
                    }}, 
                    new go.Binding("copyable", "isTreeLeaf"),
                    $("TreeExpanderButton",
                    {
                    width: 14,
                    "ButtonIcon.stroke": "blue",
                    "ButtonBorder.fill": "yellow"
                    }),
                    $(go.Panel, "Horizontal",
                    { position: new go.Point(16, 0) },
                    new go.Binding("background", "isSelected", function (s) { return (s ? "lightblue" : "white"); }),
                    $(go.Picture,
                      {
                        width: 18, height: 18,
                        margin: new go.Margin(0, 4, 0, 0),
                        imageStretch: go.GraphObject.Uniform
                      },
                      // bind the picture source on two properties of the Node
                      // to display open folder, closed folder, or document
                      new go.Binding("source", "isTreeExpanded", this.imageConverter).ofObject(),
                      new go.Binding("source", "isTreeLeaf", this.imageConverter).ofObject()),
                    $(go.TextBlock,
                    new go.Binding("text", "name"))
                    ) // end Horizontal Panel
                    ); // end Node

                    
  
                   

                    var paletteList = new Array(
                      { 'key' : 'I4','parent' : '2', 'name' : 'one','type':'PID','color':'lightblue','text': "Alpha",'isTreeLeaf': true},
                      { 'key' : 'I5','parent' : '2', 'name' : 'two','type':'PID', 'color':'orange','text': "Beta",'isTreeLeaf': true},
                      { 'key' : 'I6','parent' : '2', 'name' : 'three','type':'PID','color':'lightgreen','text': "Gamma", 'isTreeLeaf': true},
                      { 'key' : 'I7','parent' : '2', 'name' : 'four','type':'PID','color':'pink','text': "Delta", 'isTreeLeaf': true},
                      { 'key' : 'I8','parent' : '2', 'name' : 'five','type':'PID','color':'yellow','text': "Epsilon", 'isTreeLeaf': true},
                      { 'key' : 'I9','parent' : '2', 'name' : 'Controller1','type':'PID','color':'#18499e','text': "Controller1", 'isTreeLeaf': true},
                      { 'key' : 'I10','parent' : '2', 'name' : 'Device2','type':'PID','color':'#18499e','text': "Device2", 'isTreeLeaf': true},
                      { 'key' : '2' , 'parent' : '','name' : 'Test1','type':'PID','color':'yellow','text': "", 'isTreeLeaf': false},
                      { 'key' : '1' , 'parent' : '','name' : 'Test2','type':'PID','color':'yellow','text': "", 'isTreeLeaf': false},
                      { 'key' : 'I8','parent' : '1', 'name' : 'five','type':'PID','color':'yellow','text': "Epsilon", 'isTreeLeaf': true},
                      { 'key' : 'I9','parent' : '1', 'name' : 'Controller1','type':'PID','color':'#18499e','text': "Controller1", 'isTreeLeaf': true},
                      { 'key' : 'I10','parent' :'1', 'name' : 'Device2','type':'PID','color':'#18499e','text': "Device2", 'isTreeLeaf': true}                 
                    )
  
                    this.treePalette.model = new go.TreeModel(paletteList);
                    

                    
    }

    imageConverter(prop, picture) {
      var node = picture.part;
      if (node.isTreeLeaf) {
        return "assets/document.png";
      } else {
        if (node.isTreeExpanded) {
          return "assets/openFolder.png";
        } else {
          return "assets/closedFolder.png";
        }
      }
    }
}

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
      { category:"Device1",
        Name:"Controller",
        Type:"controller",
        text:"Controller1",
        group:"",
        Description:"Device1 Desc",
        Iports:["PV","SV","PB","Ti","Td"],
        Oports:["MV"],
        color: "#18499e"
      },
      { category:"AndGate",
        Name:"AndGate",
        text:"And Gate",
        Type:"deviceAndGate",
        group:"",
        Description:"AndGate Desc",
        Iports:["I1","I2"],
        Oports:["O1"],
        color: "#18499e"
      },
      { category:"Not Gate",
        Name:"NotGate",
        text:"Not Gate",
        Type:"deviceNotGate",
        group:"",
        Description:"Device2 Desc",
        Iports:["I1","I2"],
        Oports:["O1"],
        color: "#18499e"
      },
      { category:"variable1",
        Name:"variable1",
        text:"variable1",
        Type:"variable1",
        group:"",
        Description:"variable1 Desc",
        Iports:[],
        Oports:[],
        color: "#18499e"
      },
      { category:"variable2",
        Name:"variable2",
        text:"variable2",
        Type:"variable2",
        group:"",
        Description:"variable2 Desc",
        Iports:[],
        Oports:[],
        color: "#18499e"
      }];
      paletteList:any;
    
      constructor(){
      this.paletteList = new Array(
        { 'key' : '1' , 'parent' : '','name' : 'PID Controllers','type':'controller','color':'yellow','text': 'PID Controllers', 'isTreeLeaf': false},
        { 'key' : '2' , 'parent' : '','name' : 'Gate Controllers','type':'deivce','color':'yellow','text': 'Gate Controllers', 'isTreeLeaf': false},
        { 'key' : '3' , 'parent' : '','name' : 'Variable','type':'variable1','color':'yellow','text': 'Variable', 'isTreeLeaf': false}
      )
    }
  
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
                        "ButtonBorder.fill": "lightblue"
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
                    $(go.TextBlock,{font:" 15px Georgia, Serif"},
                        new go.Binding("text", "text"))
                      ) // end Horizontal Panel
                    ); // end Node

                    
                    for(var a=0;a<this.inputArray.length;a++){
                      var obj = {};
                        if(this.inputArray[a].Type.includes("variable")){
                          obj["parent"] = "3";
                          obj["name"] = this.inputArray[a].Name;
                          obj["type"] = this.inputArray[a].Type;
                          obj["color"] = this.inputArray[a].color;
                          obj["text"] = this.inputArray[a].text;
                          obj["group"] ="";
                          obj["grpName"] ="";
                          obj["isTreeLeaf"] = true;
                          this.paletteList.push(obj);
                        }
                        if(this.inputArray[a].Type.includes("controller")){
                          obj["parent"] = "1";
                          obj["name"] = this.inputArray[a].Name;
                          obj["type"] = this.inputArray[a].Type;
                          obj["color"] = this.inputArray[a].color;
                          obj["text"] = this.inputArray[a].text;
                          obj["group"] ="";
                          obj["grpName"] ="";
                          obj["isTreeLeaf"] = true;
                          this.paletteList.push(obj);
                        }
                        if(this.inputArray[a].Type.includes("device")){
                          obj["parent"] = "2";
                          obj["name"] = this.inputArray[a].Name;
                          obj["type"] = this.inputArray[a].Type;
                          obj["color"] = this.inputArray[a].color;
                          obj["text"] = this.inputArray[a].text;
                          obj["group"] ="";
                          obj["grpName"] ="";
                          obj["isTreeLeaf"] = true;
                          this.paletteList.push(obj);
                        }
                    }
  
                    this.treePalette.model = new go.TreeModel(this.paletteList);
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

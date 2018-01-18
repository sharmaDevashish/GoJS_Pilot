import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import * as go from 'gojs';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Group } from 'gojs';
//import { RealtimeDragSelectingTool } from "gojs";



@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.css']
})
export class DiagramEditorComponent implements OnInit, AfterViewInit {
  private diagram: go.Diagram = new go.Diagram();
  private palette: go.Palette = new go.Palette();

  paletteMap:any;
  DiaModel:any;
  selectedNode:any;
  flag:boolean;
  
  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  @ViewChild('palette')
  private paletteRef: ElementRef;

  @Input()
  get model(): go.Model { return this.diagram.model; }
  set model(val: go.Model) { this.diagram.model = val; }
   

  @Output()
  nodeSelected = new EventEmitter<go.Node|null>();

  @Output()
  modelChanged = new EventEmitter<go.ChangedEvent>();

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
    },
    {
      category:"comment",
      Name:"comment",
      text:"comment",
      Type:"comment",
      group:"",
      Description:"comment Desc",
      Iports:[],
      Oports:[],
      color: "#FFFF00"
    }];

    

  drawDiagramEditor(){

    const ggm = go.GraphObject.make;
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    //this.diagram.toolManager.dragSelectingTool = new go.RealtimeDragSelectingTool();
    this.diagram.allowDrop = true;  // necessary for dragging from Palette
    this.diagram.undoManager.isEnabled = true;
    
    this.diagram.addDiagramListener("ChangedSelection",
        e => {
          const node = e.diagram.selection.first();
          this.nodeSelected.emit(node instanceof go.Node ? node : null);
        });
    this.diagram.addDiagramListener("LinkDrawn",
        e => {
          console.log(e);
        });
    this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));

    this.diagram.addDiagramListener("BackgroundSingleClicked",
        e =>{
            var location = e.diagram.lastInput.documentPoint;
            console.log(location);
            var locationX = location.x;
            var locationY = location.y;
            var locx = location.x.toString();
            var locy = location.y.toString();
            var loc = locx+" "+locy;
            console.log(this.selectedNode);
            this.flag = true;
           

            var _makeportsinput = [];
            var _makeportsoutput = [];

            for(var i=0;i<this.inputArray.length;i++){
              if(this.inputArray[i].Name == this.selectedNode.data.name){
            var templateItem = this.inputArray[i];

            for(var j=0;j<templateItem.Iports.length;j++)
                {
                var iport = this.makePort(templateItem.Iports[j],true);
                _makeportsinput.push(iport);
                }
            for(var j=0;j<templateItem.Oports.length;j++)
                {
                var oport=this.makePort(templateItem.Oports[j],false);
                _makeportsoutput.push(oport);
                }
                this.makeTemplate(this.inputArray[it].Name,
                    this.inputArray[i].Type,
                    this.inputArray[i].text,
                    this.inputArray[i].color,
                    _makeportsinput,
                    _makeportsoutput,
                    locx,locy
                );
              }
            }
                this.flag = false;
                this.selectedNode = "";         
      })

    

    this.diagram.grid = 
        ggm(go.Panel,"Grid",
            {gridCellSize:new go.Size(20,20)},
            ggm(go.Shape, "LineH", { stroke: "black",interval:10 }),
            ggm(go.Shape, "LineV", { stroke: "black",interval:10 }),
            ggm(go.Shape, "LineH", { stroke: "#E1E1E1",interval:1 }),
            ggm(go.Shape, "LineV", { stroke: "#E1E1E1",interval:1 })
        );

    this.diagram.linkTemplate =
        ggm(go.Link,
          // allow relinking
          { routing: go.Link.Orthogonal,relinkableFrom: true, relinkableTo: true, 
            curve: go.Link.JumpOver },
          ggm(go.Shape),
          ggm(go.Shape, { toArrow: "OpenTriangle" })
        );

    for(var it=0; it < this.inputArray.length;it++){
    if(!this.inputArray[it].Type.includes("variable")){
      var _makeportsinput = [];
      var _makeportsoutput = [];

      var templateItem = this.inputArray[it];

      for(var j=0;j<templateItem.Iports.length;j++)
          {
           var iport = this.makePort(templateItem.Iports[j],true);
          _makeportsinput.push(iport);
          }
      for(var j=0;j<templateItem.Oports.length;j++)
          {
          var oport=this.makePort(templateItem.Oports[j],false);
          _makeportsoutput.push(oport);
          }
          this.makeTemplate(this.inputArray[it].Name,this.inputArray[it].Type,
               this.inputArray[it].text,
               this.inputArray[it].color,
               _makeportsinput,
               _makeportsoutput,
               "0","0"
              );         
      }else{
        {
          this.makeVariable(this.inputArray[it].Type,
               this.inputArray[it].Name,
               this.inputArray[it].color)
          }
      }
    }

  this.palette.nodeTemplate =
    ggm(go.Node, "Auto",
        {click: (e, node) => {
          this.selectedNode = node;
          console.log(this.selectedNode);
      }},
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
          new go.Binding("fill", "color"),
          /*new go.Binding("fill", "isSelected", function(sel) {
            if (sel) return "cyan"; else return "color";
          }).ofObject("")*/),
        ggm(go.Picture,"./assets/closedFolder.png",
        { column: 0, width: 70, height: 38, margin: 2,
          imageStretch: go.GraphObject.Fill }),
        ggm(go.TextBlock,
          { margin: 8},
          new go.Binding("text", "name").makeTwoWay())
      ); 

    var _tempnodeDataArray = [];
      for(var i=0;i<this.inputArray.length;i++){
          _tempnodeDataArray[i] = {
            "type":(this.inputArray[i].Type),
            "name":(this.inputArray[i].Name),
            "text":(this.inputArray[i].text),
            "color":(this.inputArray[i].color)
          };   
      }
      
      this.palette.model.nodeDataArray = _tempnodeDataArray;
      _tempnodeDataArray = [];

  }

  public makePort(name, leftside) {
    const ggm = go.GraphObject.make;
    var port = ggm(go.Shape, "Rectangle",
                 {
                   fill: "gray", stroke: null,
                   desiredSize: new go.Size(8, 8),
                   portId: name,  // declare this object to be a "port"
                   toMaxLinks: 1,  // don't allow more than one link into a port
                   cursor: "pointer",  // show a different cursor to indicate potential link point
                   name:"SHAPE"
                 });

    var lab = ggm(go.TextBlock, name,  // the name of the port
                { font :"10px Noto Sans",
                  stroke :"#fff"
       });

    var panel = ggm(go.Panel, "Horizontal",
                  { margin: new go.Margin(2, 0) });

    // set up the port/panel based on which side of the node it will be on
    if (leftside) {
      port.toSpot = go.Spot.Left;
      port.toLinkable = true;
      lab.margin = new go.Margin(1, 0, 0, 1);
      panel.alignment = go.Spot.TopLeft;
      panel.add(port);
      panel.add(lab);
    } else {
      port.fromSpot = go.Spot.Right;
      port.fromLinkable = true;
      lab.margin = new go.Margin(1, 1, 0, 0);
      panel.alignment = go.Spot.TopRight;
      panel.add(lab);
      panel.add(port);
    }
    return panel;
  }

  public makeTemplate(name,typename,text, background, inports, outports,x,y) {
    const ggm = go.GraphObject.make; 
 
    if(!typename.includes("variable")){
      if(typename.includes("comment")){
        var node = ggm(go.Node, "Auto",{padding:0},
        {selectionAdorned: true,location:new go.Point(x,y),copyable:false},

        ggm(go.Shape, "RoundedRectangle",
        {
          fill: background, stroke: null, strokeWidth: 0,
          spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight,
          name: "SHAPE"
        }),

          ggm(go.Panel, "Table",//{align:go.Spot.Center},
          ggm(go.TextBlock,text,
          {
            text:text,
            editable: true,
            textAlign: "center",
            wrap: go.TextBlock.WrapDesiredSize,
            stroke: "#000",
            font: "bold 14px Noto Sans"
          },
        new go.Binding("text", "text").makeTwoWay())
      )
    );
    if(this.flag == true){
      this.diagram.startTransaction("addNodeOnClick");
      this.diagram.model.addNodeData(node);
      this.diagram.commitTransaction("addNodeOnClick")
    }else{
      this.diagram.nodeTemplateMap.add(typename, node);
    }
      }else{
        var a=inports.length;
        var node = ggm(go.Node, "Auto",{padding:0},
                    {selectionAdorned: true,location:new go.Point(x,y)},
                    new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
          ggm(go.Panel, "Auto",
            {width: 120,height:17*a,minSize:new go.Size(120,80)},//mouseEnter: this.mouseEnter,mouseLeave: this.mouseLeave},
            ggm(go.Shape, "RoundedRectangle",
              {
                fill: background, stroke: null, strokeWidth: 0,
                spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight,
                name: "SHAPE"
              }),
              
            ggm(go.Panel, "Table",
                {padding:0},
              ggm(go.TextBlock, name,
                {
                  text:name,
                  row: 0,
                  margin: 3,
                  maxSize: new go.Size(80, NaN),
                  stroke: "#fff",
                  font: "12px Noto Sans,Regular"
                }),
              ggm(go.TextBlock,
                {
                  text:text,
                  row: 1,
                  margin:  3,
                  editable: true,
                  maxSize: new go.Size(80, 40),
                  stroke: "#fff",
                  font: "bold 14px Noto Sans"
                },
                new go.Binding("text", "text").makeTwoWay())
            )
          ),
          ggm(go.Panel, "Vertical",
            { alignment: go.Spot.Left,
              alignmentFocus: new go.Spot(0, 0.5, -8, 0)
            },
            inports),
          ggm(go.Panel, "Vertical",
            { alignment: go.Spot.Right,
              alignmentFocus: new go.Spot(1, 0.5, 8, 0)
            },
            outports)
        );
        if(this.flag == true){
          this.diagram.startTransaction("addNodeOnClick");
          this.diagram.model.addNodeData(node);
          this.diagram.commitTransaction("addNodeOnClick")
        }else{
            this.diagram.nodeTemplateMap.add(typename, node);
        }
      }
    }
  }

  makeVariable(typename,name, background) {
    const ggm = go.GraphObject.make; 
    var node = ggm(go.Node, "Spot",
                 {selectionAdorned: true},
                 new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
       ggm(go.Panel, "Auto",
         { width: 120},
         ggm(go.Shape, "RoundedRectangle",
           {
             fill: "#aaa", stroke: null, strokeWidth: 0,
             portId: name, cursor: "pointer",
             //spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight,
             fromLinkable: true, fromLinkableSelfNode: false, fromLinkableDuplicates: true,
             toLinkable: true, toLinkableSelfNode: false, toLinkableDuplicates: true
           }),
         ggm(go.Panel, "Table",
           ggm(go.TextBlock,name,
             {
               row: 1,
               margin: 3,
               editable: true,
               maxSize: new go.Size(80, 40),
               stroke: "#000",
               font: "bold 14px Noto Sans"
             },
             new go.Binding("text", name).makeTwoWay())
         )
       )
     );
     if(this.flag == true){
      this.diagram.startTransaction("addNodeOnClick");
      this.diagram.model.addNodeData(node);
      this.diagram.commitTransaction("addNodeOnClick")
      }else{
        this.diagram.nodeTemplateMap.add(typename, node);
      }
    }

 /*mouseEnter(e,obj){
  var shape = obj.findObject("SHAPE");
  shape.fill = "#6DAB80";
  shape.stroke = "#A6E6A1";
 }

  mouseLeave(e, obj) {
    var shape = obj.findObject("SHAPE");
    // Return the Shape's fill and stroke to the defaults
    shape.fill = "#18499e";
    shape.stroke = null;
  };*/

  /*makeNode(text,Type,Name,color,_makeportsinput,_makeportsoutput,x,y){
    this.diagram.startTransaction("add node");
    this.diagram.model.addNodeData({
      text: text,
      location: new go.Point(x,y) 
    });
    this.diagram.commitTransaction("add node");
  }*/

  addToGrp1(){
    console.log(this.diagram.selection.toArray());
    var selNodes = this.diagram.selection.toArray();
    /*this.diagram.startTransaction("make new group");
    this.diagram.model.addNodeData({ key: "Omega", isGroup: true });
    this.diagram.commitTransaction("make new group");*/
    
    for(var a=0;a<selNodes.length;a++){
      this.diagram.startTransaction("add new member");
      this.diagram.selection.each(ele => {
        ele["Zd"]["group"] = "grp1";
      });
      this.diagram.commitTransaction("add new member");
    }
  }

  addToGrp2(){
    console.log(this.diagram.selection.toArray());
    var selNodes = this.diagram.selection.toArray();
    for(var a=0;a<selNodes.length;a++){
      this.diagram.startTransaction("add new member");
      this.diagram.selection.each(ele => {
        ele["Zd"]["group"] = "grp2";
      });
      this.diagram.commitTransaction("add new member");
    }
  }

  showGrid(){
    const ggm = go.GraphObject.make;
    var point = new go.Point(0,0)
    for(var i=0;i<5;i++){
        
        point.y = 0;
        point.y = point.y+(842*i);
        
        for(var j=0;j<5;j++){
            point.x=0;
            point.x = point.x+(595*j); 
            this.diagram.add(
            ggm(go.Part, "Horizontal",{name:"A4",movable:false,selectable:false,location:point},
                ggm(go.Shape, "Rectangle",
                            { name:"A4",width: 595, height: 842, margin:0, stroke: "green",fill:"transparent",strokeWidth: 3})
            )
        )
    }
  }
}

save(){
  console.log(this.diagram.model);
  var diaModel = this.diagram.model;
  var diaModelStr = JSON.stringify(diaModel);
  sessionStorage.setItem("model" ,diaModelStr);
}

saveFiles(){
  var model1=new Object();
  model1["Device"] = "grp1";
  model1["nodeList"] = new Object();
  model1["nodeList"]["functionBlockList"] = [];
  //model1["nodeList"]["deviceList"] = [];
  model1["nodeList"]["variableList"] = [];
  model1["connections"] = new Object();
  model1["connections"]["local"] = [];
  model1["connections"]["incoming"] = [];
  model1["connections"]["outgoing"] = [];
  
  var model2=new Object();
  model2["Device"] = "grp2";
  model2["nodeList"] = new Object();
  model2["nodeList"]["functionBlockList"] = [];
  ///model2["nodeList"]["deviceList"] = [];
  model2["nodeList"]["variableList"] = [];
  model2["connections"] = new Object();
  model2["connections"]["local"] = [];
  model2["connections"]["incoming"] = [];
  model2["connections"]["outgoing"] = [];
  
  var myModel = [];
  var myLinks = [];
  
  
  myModel = this.diagram.model.nodeDataArray;
  myLinks = this.diagram.model["linkDataArray"];
  
  for(var i=0;i<myModel.length;i++){
    if(myModel[i].group == "grp1"){
      if(myModel[i].type.includes("controller") || myModel[i].type.includes("device")){
        var controllerListData = new Object();
        controllerListData["name"] = myModel[i].text;
        controllerListData["group"] = myModel[i].group;
        controllerListData["type"] = myModel[i].name;
        model1["nodeList"]["functionBlockList"].push(controllerListData);
      }
      if(myModel[i].type.includes("variable")){
        var variableListData = new Object();
        variableListData["name"] = myModel[i].text;
        variableListData["group"] = myModel[i].group;
        variableListData["type"] = myModel[i].name;
        model1["nodeList"]["variableList"].push(variableListData);
      }
      /*if(myModel[i].type.includes("device")){
        var deviceListData = new Object();
        deviceListData["name"] = myModel[i].text;
        deviceListData["group"] = myModel[i].group;
        deviceListData["type"] = myModel[i].name;
        model1["nodeList"]["deviceList"].push(deviceListData);
      }*/
    }else{
      if(myModel[i].type.includes("controller") || myModel[i].type.includes("device")){
        var controllerListData = new Object();
        controllerListData["name"] = myModel[i].text;
        controllerListData["group"] = myModel[i].group;
        controllerListData["type"] = myModel[i].name;
        model2["nodeList"]["functionBlockList"].push(controllerListData);
      }
      if(myModel[i].type.includes("variable")){
        var variableListData = new Object();
        variableListData["name"] = myModel[i].text;
        variableListData["group"] = myModel[i].group;
        variableListData["type"] = myModel[i].name;
        model2["nodeList"]["variableList"].push(variableListData);
      }
      /*if(myModel[i].type.includes("device")){
        var deviceListData = new Object();
        deviceListData["name"] = myModel[i].text;
        deviceListData["group"] = myModel[i].group;
        deviceListData["type"] = myModel[i].name;
        model2["nodeList"]["deviceList"].push(deviceListData);
      }*/
    }
  }
  for(var i=0;i<myLinks.length;i++){
    var linkData = new Object();
    //if(myLinks[i].group == "grp1"){
      for(var it=0;it<myModel.length;it++){
        if((myModel[it].key == myLinks[i].from) && (myModel[it].group == "grp1")){
          for(var a=0;a<myModel.length;a++){
            if((myModel[a].key == myLinks[i].to) && (myModel[a].group == "grp1")){
              var localLinksData = new Object();
              localLinksData["from"] = myModel[it].text;
              localLinksData["to"] = myModel[a].text;
              localLinksData["fromPID"] = myLinks[i].frompid;
              localLinksData["toPID"] = myLinks[i].topid;
              model1["connections"]["local"].push(localLinksData);
            }
            if((myModel[a].key == myLinks[i].to) && (myModel[a].group != "grp1")){
              var outLinksData = new Object();
              outLinksData["from"] = myModel[it].text;
              outLinksData["to"] = myModel[a].text;
              outLinksData["fromPID"] = myLinks[i].frompid;
              outLinksData["toPID"] = myLinks[i].topid;
              model1["connections"]["outgoing"].push(outLinksData);
            }
          }
        }
        if((myModel[it].key == myLinks[i].from) && (myModel[it].group != "grp1")){
          for(var b=0;b<myModel.length;b++){
            if((myModel[b].key == myLinks[i].to) && (myModel[b].group == "grp1")){
              var inLinksData = new Object();
              inLinksData["from"] = myModel[it].text;
              inLinksData["to"] = myModel[b].text;
              inLinksData["fromPID"] = myLinks[i].frompid;
              inLinksData["toPID"] = myLinks[i].topid;
              inLinksData["fromGrp"] = myModel[it].group;
              model1["connections"]["incoming"].push(inLinksData);
            }
          }
        }
      }
  }

  for(var i=0;i<myLinks.length;i++){
    var linkData = new Object();
    //if(myLinks[i].group == "grp1"){
      for(var it=0;it<myModel.length;it++){
        if((myModel[it].key == myLinks[i].from) && (myModel[it].group == "grp2")){
          for(var a=0;a<myModel.length;a++){
            if((myModel[a].key == myLinks[i].to) && (myModel[a].group == "grp2")){
              var localLinksData = new Object();
              localLinksData["from"] = myModel[it].text;
              localLinksData["to"] = myModel[a].text;
              localLinksData["fromPID"] = myLinks[i].frompid;
              localLinksData["toPID"] = myLinks[i].topid;
              model2["connections"]["local"].push(localLinksData);
            }
            if((myModel[a].key == myLinks[i].to) && (myModel[a].group != "grp2")){
              var outLinksData = new Object();
              outLinksData["from"] = myModel[it].text;
              outLinksData["to"] = myModel[a].text;
              outLinksData["fromPID"] = myLinks[i].frompid;
              outLinksData["toPID"] = myLinks[i].topid;
              model2["connections"]["outgoing"].push(outLinksData);
            }
          }
        }
        if((myModel[it].key == myLinks[i].from) && (myModel[it].group != "grp2")){
          for(var b=0;b<myModel.length;b++){
            if((myModel[b].key == myLinks[i].to) && (myModel[b].group == "grp2")){
              var inLinksData = new Object();
              inLinksData["from"] = myModel[it].text;
              inLinksData["to"] = myModel[b].text;
              inLinksData["fromPID"] = myLinks[i].frompid;
              inLinksData["toPID"] = myLinks[i].topid;
              inLinksData["fromGrp"] = myModel[it].group;
              model2["connections"]["incoming"].push(inLinksData);
            }
          }
        }
      }
  }
  console.log(JSON.stringify(model1));
  console.log(JSON.stringify(model2));
}

zoomIn(){
  this.diagram.commandHandler.increaseZoom();
}

zoomOut(){
  this.diagram.commandHandler.decreaseZoom();
}

printImage(){
      
    var width = parseInt("595");
    var height = parseInt("842");
    if (isNaN(width)) width = 100;
    if (isNaN(height)) height = 100;
    // Give a minimum size of 50x50
    width = Math.max(width, 50);
    height = Math.max(height, 50);

    var db = this.diagram.documentBounds.copy();
    var boundswidth = db.width;
    var boundsheight = db.height;
    var imgWidth = width;
    var imgHeight = height;
    var p = db.position.copy();
    var imagesArr = [];
    for (var i = 0; i < boundsheight; i += imgHeight) {
      for (var j = 0; j < boundswidth; j += imgWidth) {
        var img = this.diagram.makeImage({
          scale: 1,
          position: new go.Point(p.x + j, p.y + i),
          size: new go.Size(imgWidth, imgHeight)
        });
        img.className = 'images'+j;
        imagesArr.push(img.src);
      }
    }
    var arr = JSON.stringify(imagesArr);
    sessionStorage.setItem("image",arr);
    this.router.navigate(["preview"]);
}

  constructor(private router: Router) {
    this.drawDiagramEditor();
}

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    this.palette.div = this.paletteRef.nativeElement;
    
  }

  ngAfterViewInit(){
    if(sessionStorage.getItem("model")){
      var diaModel = sessionStorage.getItem("model");
      diaModel = JSON.parse(diaModel);
      console.log(diaModel);
      this.model = go.Model.fromJson(diaModel);
      console.log(this.model);
    }
  }
}

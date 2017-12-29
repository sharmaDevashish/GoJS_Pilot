import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import * as go from 'gojs';

@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.css']
})
export class DiagramEditorComponent implements OnInit {
  private diagram: go.Diagram = new go.Diagram();
  //private palette: go.Palette = new go.Palette();
  paletteMap:any;
  DiaModel:any;

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  /*@ViewChild('paletteDiv')
  private paletteRef: ElementRef;*/

  @Input()
  get model(): go.Model { return this.diagram.model; }
  set model(val: go.Model) { this.diagram.model = val; }
   

  @Output()
  nodeSelected = new EventEmitter<go.Node|null>();

  @Output()
  modelChanged = new EventEmitter<go.ChangedEvent>();

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
    }];

  drawDiagramEditor(){

    const ggm = go.GraphObject.make;
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;  // necessary for dragging from Palette
    this.diagram.undoManager.isEnabled = true;
    this.diagram.addDiagramListener("ChangedSelection",
        e => {
          const node = e.diagram.selection.first();
          this.nodeSelected.emit(node instanceof go.Node ? node : null);
        });
    this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));

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
          { relinkableFrom: true, relinkableTo: true },
          ggm(go.Shape),
          ggm(go.Shape, { toArrow: "OpenTriangle" })
        );

    for(var it=0; it < this.inputArray.length;it++)
    {if(!this.inputArray[it].Type.includes("Variable")){
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
          this.makeTemplate(this.inputArray[it].Type,
               this.inputArray[it].Name,
               this.inputArray[it].color,
               _makeportsinput,
               _makeportsoutput
              );         
      }
    }
  }

  public makePort(name, leftside) {
    const ggm = go.GraphObject.make;
    var port = ggm(go.Shape, "Rectangle",
                 {
                   fill: "gray", stroke: null,
                   desiredSize: new go.Size(8, 8),
                   portId: name,  // declare this object to be a "port"
                   toMaxLinks: 1,  // don't allow more than one link into a port
                   cursor: "pointer"  // show a different cursor to indicate potential link point
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

  public makeTemplate(typename,name, background, inports, outports) {
    const ggm = go.GraphObject.make; 
 
    var a=inports.length;
    var node = ggm(go.Node, "Spot",{padding:0},//,dragComputation: avoidNodeOverlap},
                 {selectionAdorned: false},
                 new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
       ggm(go.Panel, "Auto",
         {width: 120,height:17*a,minSize:new go.Size(120,80)},
         ggm(go.Shape, "RoundedRectangle",
           {
             fill: background, stroke: null, strokeWidth: 0,
             spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight
           }),
         ggm(go.Panel, "Table",
             {padding:0},
           ggm(go.TextBlock, typename,
             {
               text:typename,
               row: 0,
               margin: 3,
               maxSize: new go.Size(80, NaN),
               stroke: "#fff",
               font: "12px Noto Sans,Regular"
             },
             new go.Binding("text", typename).makeTwoWay()),
           ggm(go.TextBlock,name,
             {
               text:name,
               row: 1,
               margin:  3,
               editable: true,
               maxSize: new go.Size(80, 40),
               stroke: "#fff",
               font: "bold 14px Noto Sans"
             },
             new go.Binding("text", name).makeTwoWay())
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
     this.diagram.nodeTemplateMap.add(typename, node);
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
    /*this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape,
          {
            fill: "white", strokeWidth: 0,
            portId: "", cursor: "pointer",
            // allow many kinds of links
            fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay())
      );*/

    
}

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    //this.palette.div = this.paletteRef.nativeElement;
    
  }
}

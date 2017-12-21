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
        /*sessionStorage.setItem("image"+j,img.src);
        var a =JSON.stringify(j);
        sessionStorage.setItem("j",a);*/
      }
    }
    var arr = JSON.stringify(imagesArr);
    sessionStorage.setItem("image",arr);
    this.router.navigate(["preview"]);
}

  constructor(private router: Router) {
    const $ = go.GraphObject.make;
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
        $(go.Panel,"Grid",
            {gridCellSize:new go.Size(20,20)},
            $(go.Shape, "LineH", { stroke: "black",interval:10 }),
            $(go.Shape, "LineV", { stroke: "black",interval:10 }),
            $(go.Shape, "LineH", { stroke: "#E1E1E1",interval:1 }),
            $(go.Shape, "LineV", { stroke: "#E1E1E1",interval:1 })
        );

    this.diagram.nodeTemplate =
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
      );

    this.diagram.linkTemplate =
      $(go.Link,
        // allow relinking
        { relinkableFrom: true, relinkableTo: true },
        $(go.Shape),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );

    /*this.palette = new go.Palette();
    this.palette.nodeTemplateMap = this.diagram.nodeTemplateMap;
    this.paletteMap = this.diagram.nodeTemplateMap;
    console.log(this.paletteMap);

    // initialize contents of Palette
    this.palette.model.nodeDataArray =
      [
        { text: "Alpha", color: "lightblue" },
        { text: "Beta", color: "orange" },
        { text: "Gamma", color: "lightgreen" },
        { text: "Delta", color: "pink" },
        { text: "Epsilon", color: "yellow" }
      ];*/
  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    //this.palette.div = this.paletteRef.nativeElement;
  }
}

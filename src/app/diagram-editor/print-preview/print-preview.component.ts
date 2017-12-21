import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import * as go from 'gojs';
import { forEach } from '@angular/router/src/utils/collection';



@Component({
  selector: 'print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.css']
})

export class PrintPreviewComponent implements OnInit {

  ngOnInit() {
    
    //var j = sessionStorage.getItem("j");
    //j = JSON.parse(j);
    var arr = sessionStorage.getItem("image");
    arr = JSON.parse(arr);


    for(var i=0;i<arr.length;i++){
      //var model = sessionStorage.getItem("image"+j);
      var imgDiv = document.getElementById('picsG');
      //imgDiv.innerHTML = ''; // clear out the old images, if any
      var img = document.createElement("img");
      imgDiv.appendChild(img);
      img.src = arr[i];
      imgDiv.appendChild(document.createElement('br'));
    }
  }       
}
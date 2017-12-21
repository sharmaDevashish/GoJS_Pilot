import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class ExampleService {
    
    dataMethod$:Observable<any>;
    private dataMethodSubject = new Subject<any>();

    choosenNode$:Observable<any>;
    private choosenNodeSubject = new Subject<any>();

    constructor() { 
        this.dataMethod$ = this.dataMethodSubject.asObservable();
        this.choosenNode$ = this.choosenNodeSubject.asObservable();
    }
  
  dataMethod(data){
        this.dataMethodSubject.next(data);
    }

  choosenNode(node){
      this.choosenNodeSubject.next(node);
  }

}
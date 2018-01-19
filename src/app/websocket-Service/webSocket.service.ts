import { Injectable } from '@angular/core'
import { QueueingSubject } from 'queueing-subject'
import { Observable } from 'rxjs/Observable'
import { WebSocketService } from 'angular2-websocket-service'
import * as azure from 'azure-iothub'
import * as eventHub from 'azure-event-hubs'
//var EventHub = require('azure-event-hubs').Client;
 
@Injectable()
export class ServerSocket {
  private inputStream: QueueingSubject<any>
  public outputStream: Observable<any>

  //client = eventHub.Client.fromConnectionString('HostName=IsobarIotHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=JcUihMRVjDCcSN469mCf8GApP3Om1TtTUVWBdceaMvc= ');

  constructor(private socketFactory: WebSocketService) {

    /*this.client.open().then(this.client.getPartitionIds.bind(this.client))
    .then(function(partitionIds){
      return partitionIds.map(function(partitionId){
        return this.client.createReciever('$Default',partitionId,{'startAfterTime':Date.now()}).then(function(receiver){
          console.log('Created Partition Reciever: '+ partitionId)
          receiver.on('errorReceived', this.printError);
          receiver.on('message',this.printMessage);
        });
      });
    }).catch(this.printError);*/
  
  }
  
  

  
  

  printError (err) {
    console.log(err.message);
  };

  printMessage(message) {
    console.log('Message received: ');
    console.log(JSON.stringify(message.body));
    console.log('');
  };
  
  

  public connect() {
    if (this.outputStream)
      return this.outputStream
 
    // Using share() causes a single websocket to be created when the first 
    // observer subscribes. This socket is shared with subsequent observers 
    // and closed when the observer count falls to zero. 
    return this.outputStream = this.socketFactory.connect(
      'ws://isobarapp.azurewebsites.net',
      this.inputStream = new QueueingSubject<any>()
    )
  }

  public connectToHub() {
    if (this.outputStream)
      return this.outputStream
 
    // Using share() causes a single websocket to be created when the first 
    // observer subscribes. This socket is shared with subsequent observers 
    // and closed when the observer count falls to zero. 
    return this.outputStream = this.socketFactory.connect(
      'ws://IsobarIotHub.azure-devices.net:443/$iothub/websocket',
      //'HostName=IsobarIotHub.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=CWBiMD9UXJd5UayIYZzKHVe4sN8cnJLBDM78SoBcyK8=',      
      this.inputStream = new QueueingSubject<any>()
    )
  }
 
  public send(message: any):void {
    // If the websocket is not connected then the QueueingSubject will ensure 
    // that messages are queued and delivered when the websocket reconnects. 
    // A regular Subject can be used to discard messages sent when the websocket 
    // is disconnected. 
    console.log("WS");
    console.log(JSON.stringify(message));
    this.inputStream.next(message);
    //return;
  }

  
}
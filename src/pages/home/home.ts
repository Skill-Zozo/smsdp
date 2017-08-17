import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Observable } from 'rxjs/Rx';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  counter = 0;
  showCounter = false;
  timer = Observable.timer(5000);
  subscription:any;

  constructor (
    public navCtrl: NavController,
    private dialer: CallNumber,
    private file: File
  ) {

  }

  takeMeds() {
    this.counter++;
    this.showCounter = true;
    this.revertShowCounter();
  }

  logActivity(counter) {
    var filename = '._smsdp_medication_logs.txt';
    var logEntry = new Date() + ": Medication taken " + counter + " times\n";
    if(this.checkFile(filename)) {
      this.file.writeExistingFile(this.file.dataDirectory, filename, logEntry);
    } else {
      this.file.writeFile(this.file.dataDirectory, filename, logEntry);
    }
  }

  // write export

  checkFile(file) {
    return this.file.checkFile(this.file.dataDirectory, file);
  }

  dialTwilioServer() {
    this.dialer.callNumber('+27875517189', true)
      .then(() => console.log('call'))
      .catch(() => console.log("error"))
  }

  revertShowCounter() {
    if(this.subscription) { this.subscription.unsubscribe(); }
    this.timer = Observable.timer(5000);
    this.subscription = this.timer.subscribe(() => {
      this.counter = 0;
      this.showCounter = false;
      console.log("reset")
    });
  }

}

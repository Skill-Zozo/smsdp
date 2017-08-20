import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Observable } from 'rxjs/Rx';
import { File } from '@ionic-native/file';
import { ResearchPage } from './research';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  counter = 0;
  showCounter = false;
  timer = Observable.timer(30000);
  timerSubscription: any;
  errorMessage = "";


  constructor (
    public navCtrl: NavController,
    private dialer: CallNumber,
    private file: File,
    private modalCtrl: AlertController
  ) {

  }

  launchVerificationDialog() {
    let prompt = this.modalCtrl.create({
      title: 'Admin Access',
      message: this.errorMessage,
      inputs: [
        {
          name: 'code',
          type: 'password',
          placeholder: 'Enter the code to setup user'
        }
      ],
      buttons: [
        {
          text: 'Ok',
          handler: this.authAndLaunchRsearchScreen.bind(this)
        }
      ]
    });
    prompt.present();
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

  // writeexport

  checkFile(file) {
    return this.file.checkFile(this.file.dataDirectory, file);
  }

  authAndLaunchRsearchScreen(data) {
    this.errorMessage = ''
    let authenticResearcher = data.code == "CSC4000W";
    if(authenticResearcher) {
      this.navCtrl.push(ResearchPage)
    } else {
      this.errorMessage = "Incorrect verification code, please try again"
    }
  }

  dialTwilioServer() {
    this.dialer.callNumber('+27875517189', true)
      .then(() => console.log('call'))
      .catch(() => console.log("error"))
  }

  revertShowCounter() {
    if(this.timerSubscription) { this.timerSubscription.unsubscribe(); }
    this.timer = Observable.timer(5000);
    this.timerSubscription = this.timer.subscribe(() => {
      this.counter = 0;
      this.showCounter = false;
      console.log("reset")
    });
  }

}

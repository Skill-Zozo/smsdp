import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Observable } from 'rxjs/Rx';
import { File } from '@ionic-native/file';
import { ResearchPage } from './research';
import { Storage } from '@ionic/storage';

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
  isDisabled = true;

  constructor (
    public navCtrl: NavController,
    private dialer: CallNumber,
    private file: File,
    private modalCtrl: AlertController,
    private storage: Storage
  ) {
    let homepage = this;
    this.storage.keys().then(function(keys) {
      homepage.isDisabled = keys.indexOf("smsdp_name") == -1;
      console.log('isDisabled: ', homepage.isDisabled);
    })
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
    let fullPath = this.file.dataDirectory + filename;
    let file = this.file;
    this.file.checkFile(this.file.dataDirectory, filename).then(function(fileExists){
      file.writeFile(file.dataDirectory, filename, logEntry, {append: fileExists});
    });
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
    this.timer = Observable.timer(30000);
    this.timerSubscription = this.timer.subscribe(() => {
      this.logActivity(this.counter);
      this.counter = 0;
      this.showCounter = false;
      console.log("reset")
    });
  }

}

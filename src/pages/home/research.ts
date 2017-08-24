import { Component } from '@angular/core';
import { AlertController, ViewController, App, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { HomePage } from './home';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { File } from '@ionic-native/file';

@Component({
  selector: 'research-page',
  template: `
    <ion-header>
      <ion-navbar color="dark">
        <ion-title>Research Setup</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <ion-list class="centered">
        <ion-item>
          <button ion-button round color="danger" (click)="launchUserSelection()"> Set User </button>
        </ion-item>
        <ion-item>
          <button ion-button round color="danger" (click)="exportUserLogs()" [disabled]='!userId'> Export Logs </button>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})

export class ResearchPage {
  private users = [];
  isDisabled: any;
  userId;
  user: any;

  constructor(
    private modalCtrl: AlertController,
    private viewCtrl: ViewController,
    private appCtrl: App,
    private afdb: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private storage: Storage,
    private file: File,
    private loadingCtrl: LoadingController,
    private transfer: FileTransfer
  ) {
    this.afdb.list('/users/audio')
              .subscribe(users => this.users = users.filter(user => !user.assigned || user.name == 'test-user'));

    let researchPage = this;
    this.storage.keys().then(function(keys) {
      researchPage.isDisabled = keys.indexOf("smsdp_name") == -1;
      if(!researchPage.isDisabled) {
        researchPage.storage.get('smsdp_name').then(function(userId) {
          researchPage.userId = userId;
        });
      }
    })
  }

  launchUserSelection() {
    let modal = this.modalCtrl.create();
    modal.setTitle('Pick User');

    this.users.map(function(user) {
      modal.addInput({
        type:'radio',
        label: user.name,
        value: user.$key
      });
    });

    modal.addButton('Cancel');

    modal.addButton({
      text: 'Ok',
      handler: this.setUser.bind(this)
    });

    modal.present();
  }

  setUser(data) {
    let localStorage = this.storage;
    let researchPage = this;

    // download the necessary files
    this.user = this.users.filter(user => user.$key == data)[0];
    let mediaURL = `prescription/audio/${this.user.prescription}`;
    let storageRef = firebase.storage().ref();
    let downloadSuccess = true;
    let currentlyDownloading = 'full.mp3'
    let loadingModal = this.loadingCtrl.create({
      content: `Please wait, fetching ${currentlyDownloading} from firebase`
    });
    loadingModal.present();
    ['full', 'dosage', 'sideeffects'].map(function(filename, i) {
      currentlyDownloading = `${filename}.mp3`;
      let fullFilename = `${mediaURL}/${filename}.mp3`
      storageRef.child(fullFilename).getDownloadURL().then(function(url) {
        console.log(url);
        downloadSuccess = researchPage.download(url, `${filename}.mp3`, loadingModal);
        localStorage.set(`smsdp_media_${filename}`, url);
      })
    });

    if(downloadSuccess) {
      this.afdb.list('/users/audio').update(data, {assigned: true});
      this.storage.set('smsdp_name', data);

      loadingModal.dismiss();
      this.viewCtrl.dismiss();
      this.appCtrl.getRootNav().push(HomePage);
    }
  }

  download(url, filename, loadingModal) {
    let fileTransfer = this.transfer.create();
    let downloadSuccess = true;
    fileTransfer.download(url, this.file.dataDirectory+filename).then((entry) => {
      console.log("Finished downloading");
      downloadSuccess = true;
    }).catch((error) => {
      loadingModal.setContent(`Downloading ${filename} failed. Please try again. Message will close in 5 secs`);
      console.log(error);
      downloadSuccess = false;
    })
    return downloadSuccess;
  }

  exportUserLogs() {
    let storageRef = firebase.storage().ref();
    let firebaseImageRef = storageRef.child(`audio/${this.userId}/._smsdp_medication_logs.txt`);
    let logFile = this.file.readAsText(this.file.dataDirectory, '._smsdp_medication_logs.txt').then(function(text) {
      let uploadTask = firebaseImageRef.putString(text);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          console.log("sending data");
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('done');
        }
      );
    });
  }
}

import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import WaveSurfer from 'wavesurfer.js';
import { File } from '@ionic-native/file';

@Component({
  template:
  `
    <ion-content style="background-color: #e0e0e0">
      <ion-card style="height:fit-content;" (swipe)="switchTabs($event)">
        <ion-card-title style="
          width: 100%;
          background-color:#303F9F;
          color: #fff;
        ">
          {{ tabTitle }}
        </ion-card-title>
        <ion-card-content>
          <ion-row>
            <div [id]="waveformID" class="waveform"></div>
          </ion-row>
        </ion-card-content>
        <ion-row>
          <ion-col col-3 offset-4>
            <button class="float-bottom" color="primary" ion-button name="playPauseButton" [(ngModel)]="playPauseString" ngDefaultControl (click)=playPause()>
              {{playPauseString}}
            </button>
          </ion-col>
        </ion-row>
      </ion-card>
      <ion-card style="height: fit-content;">
        <ion-card-title style="
          width: 100%;
          background-color:#303F9F;
          color: #fff;
        ">
          Umlayezo opheleleyo
        </ion-card-title>
        <ion-card-content>
          <ion-row>
            <ion-col col-2>
              <button ion-button icon-only [disabled]="canPlay" (click)="playFull()">
                <ion-icon [name]="playOrPause" [(ngModel)]="playOrPause" ngDefaultControl></ion-icon>
              </button>
            </ion-col>
            <ion-col col-9>
              <div [id]="fullPrescriptionID" class="waveform"></div>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})

export class ListenTab {
  mediaFile: any;
  wavesurfer: any;
  playPauseString = "Play";
  waveformID: any;
  index: any;
  playOrPause = "play";
  canPlay = true;
  fullWaveSurfer: any;
  tabTitle = "";
  fullPrescriptionID: any;

  constructor(private navParams: NavParams, private file: File, private navCtrl: NavController) {
    this.mediaFile = navParams.data.mediaFile;
    this.waveformID = navParams.data.waveformID;
    this.fullPrescriptionID = "full_" + navParams.data.waveformID;
    this.index = navParams.data.index;
    this.tabTitle = navParams.data.title;
  }

  switchTabs(e) {
    console.log("Direction is: ", e.direction);
    if(e.direction == '2') {
      if(this.index > 0) {
        this.navCtrl.parent.select(this.index-1);
      }
    } else if (e.direction == '4') {
      if(this.index < 2) {
        this.navCtrl.parent.select(this.index+1);
      }
    }
  }

  playFull() {
    this.fullWaveSurfer.playPause();
  }

  ionViewDidLoad() {
    let selector = "#" + this.waveformID;
    let thisTab = this;
    var wavesurfer = WaveSurfer.create({
      container: selector,
      cursorColor: '#488aff',
      progressColor: '#488aff'
    });
    console.log(this.mediaFile);
    this.file.resolveLocalFilesystemUrl(this.mediaFile).then((entryFile) => {
      wavesurfer.load(entryFile.toInternalURL());
    });
    wavesurfer.on('ready', function () {
      thisTab.playPauseString = 'Pause';
      wavesurfer.play();
    });

    wavesurfer.on('finish', function() {
      thisTab.playPauseString = 'Replay';
    });

    this.wavesurfer = wavesurfer;
    this.loadFullPrescription();
  }

  loadFullPrescription() {
    let selector = `#${this.fullPrescriptionID}`;
    let wavesurfer = WaveSurfer.create({
      container: selector,
      progressColor: '#488aff',
      barHeight: 4,
      cursorWidth: 0,
      normalize: true,
      height: 28
    });

    let tabs = this;

    this.file.resolveLocalFilesystemUrl(this.file.dataDirectory+"full.mp3").then((entryFile) => {
      wavesurfer.load(entryFile.toInternalURL());
    });

    wavesurfer.on('play', function() {
      tabs.playOrPause = "pause";
    });

    wavesurfer.on('pause', function() {
      tabs.playOrPause = "play";
    });

    wavesurfer.on('finish', function() {
      console.log('activate');
      tabs.playOrPause = "play"
    })

    wavesurfer.on('ready', function() {
      tabs.canPlay = false;
    })

    this.fullWaveSurfer = wavesurfer;
  }

  playPause() {
    if(this.playPauseString == 'Replay') {
      this.playPauseString = 'Play';
    } else {
      this.playPauseString = this.playPauseString == 'Play' ? 'Pause' : 'Play';
    }
    this.wavesurfer.playPause();
  }

  ionViewWillLeave() {
    this.wavesurfer.stop();
    this.fullWaveSurfer.stop();
  }
}

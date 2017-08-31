import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { File } from '@ionic-native/file';
import { ListenTab } from './listenTab';
import WaveSurfer from 'wavesurfer.js';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  listeningTab = ListenTab;
  sideEffects; any;
  dosage: any;
  fullPrescription: any;

  constructor(private file: File) {
    this.sideEffects = {
      mediaFile: this.file.dataDirectory + 'sideeffects.mp3',
      waveformID: "sideeffects",
      title: 'Umlayezo wemiphumela',
      index: 2
    };

    this.dosage = {
      mediaFile: this.file.dataDirectory + 'dosage.mp3',
      waveformID: 'dosage',
      title: 'Umalayezo wemlinganiselo',
      index: 0
    }

    this.fullPrescription = {
      mediaFile: this.file.dataDirectory + 'changes.mp3',
      waveformID: 'full',
      title: 'Umalayezo wetshintsho',
      index: 1
    }
  }
}

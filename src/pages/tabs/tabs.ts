import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { File } from '@ionic-native/file';

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
      mediaFile: this.file.dataDirectory + 'sideeffects.mp3'
    };

    this.dosage = {
      mediaFile: this.file.dataDirectory + 'dosage.mp3'
    }

    this.fullPrescription = {
      mediaFile: this.file.dataDirectory + 'full.mp3'
    }
  }
}

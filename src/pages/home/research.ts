import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SelectParticipantModal } from './participantsModal';

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
          <button ion-button round color="danger" (click)="launchUserSelection()"> User </button>
        </ion-item>
        <ion-item>
          <button ion-button round color="danger" (click)="exportUserLogs()"> Export Logs </button>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})

export class ResearchPage {
  users: any;
  constructor(private modalCtrl: AlertController) {
    this.users = [
      "audio-user-1",
      "text-user-1",
      "picture-user-1"
    ]
  }

  launchUserSelection() {
    let modal = this.modalCtrl.create();
    modal.setTitle('Pick User');

    this.users.map(function(user) {
      modal.addInput({
        type:'radio',
        label: user,
        value: user
      });
    });

    modal.addButton({
      text: 'Ok',
      handler: this.setUser
    })

    modal.present();
  }

  setUser(data) {
    console.log("selected user is: ", data);
  }

  exportUserLogs() {
    console.log("exporting log")
  }
}

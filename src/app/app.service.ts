import { Injectable } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import firebase from 'firebase';

export const firebaseConfig = {
  apiKey: "AIzaSyDa-WkPt1p6P-uvMj-VH2SHPCHHRmLe2VQ",
  authDomain: "ionic-smsdp.firebaseapp.com",
  databaseURL: "https://ionic-smsdp.firebaseio.com",
  projectId: "ionic-smsdp",
  storageBucket: "ionic-smsdp.appspot.com",
  messagingSenderId: "188142443030"
};

@Injectable()
export class SMSDPService {
  mediaObjects = {} ;
  constructor(private afdb: AngularFireDatabase) {

  }

  setMediaObject(hash) {
    this.mediaObjects = Object.assign(this.mediaObjects, hash);
  }
}

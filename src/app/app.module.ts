import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ResearchPage } from '../pages/home/research';
import { VerificationModal } from '../pages/home/verificationModal';
import { SelectParticipantModal } from '../pages/home/participantsModal';

import { CallNumber } from '@ionic-native/call-number';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDa-WkPt1p6P-uvMj-VH2SHPCHHRmLe2VQ",
  authDomain: "ionic-smsdp.firebaseapp.com",
  databaseURL: "https://ionic-smsdp.firebaseio.com",
  projectId: "ionic-smsdp",
  storageBucket: "ionic-smsdp.appspot.com",
  messagingSenderId: "188142443030"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    VerificationModal,
    ResearchPage,
    SelectParticipantModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    VerificationModal,
    ResearchPage,
    SelectParticipantModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

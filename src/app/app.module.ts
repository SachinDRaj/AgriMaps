import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { RecommenderPage } from '../pages/recommender/recommender';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { RecommenderMenuPage } from '../pages/recommender-menu/recommender-menu';
import { ProfileMenuPage } from '../pages/profile-menu/profile-menu';
import { CropfamiliesPage } from '../pages/cropfamilies/cropfamilies';
import { SoilseriesPage } from '../pages/soilseries/soilseries';
import { WelcomescreenPage } from '../pages/welcomescreen/welcomescreen';
import { LegendModalPage } from '../pages/legend-modal/legend-modal';
import { InitialisationPage } from '../pages/initialisation/initialisation';
import { ConnectionPage } from '../pages/connection/connection';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
// import { HTTP } from '@ionic-native/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Firebase } from '@ionic-native/firebase';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

@NgModule({
  declarations: [
    MyApp,
    RecommenderPage,
    ProfilePage,
    SettingsPage,
    RecommenderMenuPage,
    ProfileMenuPage,
    CropfamiliesPage,
    SoilseriesPage,
    WelcomescreenPage,
    LegendModalPage,
    InitialisationPage,
    ConnectionPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecommenderPage,
    ProfilePage,
    SettingsPage,
    RecommenderMenuPage,
    ProfileMenuPage,
    CropfamiliesPage,
    SoilseriesPage,
    WelcomescreenPage,
    LegendModalPage,
    InitialisationPage,
    ConnectionPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Firebase,
    Network,
    NativeGeocoder,
    // HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

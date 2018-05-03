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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

@NgModule({
  declarations: [
    MyApp,
    RecommenderPage,
    ProfilePage,
    SettingsPage,
    RecommenderMenuPage,
    ProfileMenuPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecommenderPage,
    ProfilePage,
    SettingsPage,
    RecommenderMenuPage,
    ProfileMenuPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

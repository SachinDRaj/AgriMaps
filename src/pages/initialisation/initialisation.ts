import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WelcomescreenPage } from '../welcomescreen/welcomescreen';
import { TabsPage } from '../tabs/tabs';
import { Network } from '@ionic-native/network';
import { ConnectionPage } from '../connection/connection';

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-initialisation',
  templateUrl: 'initialisation.html',
})
export class InitialisationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,private storage: Storage,public platform: Platform,public network: Network) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.checkWelcomeScreen();
    });

  }

  checkWelcomeScreen(){
    this.storage.get('welcomeCheck').then((val) => {
      if(val == null || val.length == 0){
        this.storage.set('welcomeCheck','true');
        let modal = this.modalCtrl.create(WelcomescreenPage);
        modal.onDidDismiss(data=> {
          this.navCtrl.setRoot(TabsPage);
        });
        modal.present();
      }else{
        this.checkNetwork();
      }
    });
  }

  checkNetwork() {
     this.platform.ready().then(() => {
         var networkState = navigator.connection.type;
         var states = {};
         states[Connection.UNKNOWN]  = 'Unknown connection';
         states[Connection.ETHERNET] = 'Ethernet connection';
         states[Connection.WIFI]     = 'WiFi connection';
         states[Connection.CELL_2G]  = 'Cell 2G connection';
         states[Connection.CELL_3G]  = 'Cell 3G connection';
         states[Connection.CELL_4G]  = 'Cell 4G connection';
         states[Connection.CELL]     = 'Cell generic connection';
         states[Connection.NONE]     = 'No network connection';
         if (states[networkState]=='No network connection'){
           this.navCtrl.setRoot(ConnectionPage);
         }else{
           this.navCtrl.setRoot(TabsPage);
         }
     });
   }

}

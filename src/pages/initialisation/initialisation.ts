import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WelcomescreenPage } from '../welcomescreen/welcomescreen';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-initialisation',
  templateUrl: 'initialisation.html',
})
export class InitialisationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,private storage: Storage,public platform: Platform) {
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
        this.navCtrl.setRoot(TabsPage);
      }
    });
  }

}

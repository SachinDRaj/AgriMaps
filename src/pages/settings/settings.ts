import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController} from 'ionic-angular';
import { SoilseriesPage } from '../soilseries/soilseries';
import { CropfamiliesPage } from '../cropfamilies/cropfamilies';
import { WelcomescreenPage } from '../welcomescreen/welcomescreen';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  item: string = "instructions";
  isAndroid: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform,public modalCtrl: ModalController) {
    this.isAndroid = platform.is('android');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  presentSModal() {
    let modal = this.modalCtrl.create(SoilseriesPage);
    modal.present();
  }

  presentCModal() {
    let modal = this.modalCtrl.create(CropfamiliesPage);
    modal.present();
  }

  openWelcome(){
    let modal = this.modalCtrl.create(WelcomescreenPage);
    modal.present();
  }

}


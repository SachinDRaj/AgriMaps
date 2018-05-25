import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-legend-modal',
  templateUrl: 'legend-modal.html',
})
export class LegendModalPage {

  item = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get('param1');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LegendModalPage');
  }

  dismiss(){
    this.navCtrl.pop();
  }

}

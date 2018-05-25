import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-legend-modal',
  templateUrl: 'legend-modal.html',
})
export class LegendModalPage {

  catUrl = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.catUrl = this.navParams.get('param1');
    console.log(this.catUrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LegendModalPage');
  }

  dismiss(){
    this.navCtrl.pop();
  }

}

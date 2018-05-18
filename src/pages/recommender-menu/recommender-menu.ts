import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-recommender-menu',
  templateUrl: 'recommender-menu.html',
})
export class RecommenderMenuPage {

  radius = 1000;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.radius = this.navParams.get('param1');
    console.log('ionViewDidLoad RecommenderMenuPage');
  }

  dismiss(item,subtitle) {
    this.viewCtrl.dismiss({
      catUrl: item,
      rad: this.radius,
      subtitle: subtitle
    });
  }

  goToMap(){
    this.navCtrl.pop();
  }

}

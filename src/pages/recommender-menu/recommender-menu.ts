import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the RecommenderMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recommender-menu',
  templateUrl: 'recommender-menu.html',
})
export class RecommenderMenuPage {

  radius: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
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

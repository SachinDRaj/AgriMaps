import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the WelcomescreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcomescreen',
  templateUrl: 'welcomescreen.html',
})
export class WelcomescreenPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomescreenPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  slides = [
    {
      title: "Welcome to AgriMaps!",
      description: "AgriMaps is mobile application which displays land and soil information using a map interface.",
      image: "assets/imgs/agrimapsicon.png",
    },
    {
      title: "Land Profile Mode",
      description: "The AgriMaps Land Profile Mode displays information such as annual rainfall, land use and soil properties.",
      image: "assets/imgs/screen2.png",
    },
    {
      title: "Recommender Mode",
      description: "The AgriMaps Recommender Mode displays information regarding the suitability of soil for the planting of specific crops.",
      image: "assets/imgs/screen3.png",
    }
    ,
    {
      title: "More Information / Help",
      description: "The More Information Button, highlighted above, can be pressed to display information about the application and instructions for its usage.",
      image: "assets/imgs/screen4.png",
    }
  ];
}

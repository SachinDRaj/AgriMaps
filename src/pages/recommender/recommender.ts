import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { RecommenderMenuPage } from '../recommender-menu/recommender-menu';

@Component({
  selector: 'page-recommender',
  templateUrl: 'recommender.html'
})
export class RecommenderPage {

  constructor(public navCtrl: NavController) {

  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  openRMenu(){
    this.navCtrl.push(RecommenderMenuPage);
  }

}

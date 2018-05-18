import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
// import { ProfilePage } from '../profile/profile';
// import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-profile-menu',
  templateUrl: 'profile-menu.html',
})
export class ProfileMenuPage {

  radius = 1000;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.radius = this.navParams.get('param1');
    console.log('ionViewDidLoad ProfileMenuPage');
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
    // this.navCtrl.setRoot(TabsPage);
    // this.TabsPage.selectProfilePage();
  }

}

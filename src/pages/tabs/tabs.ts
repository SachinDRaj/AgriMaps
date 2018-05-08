import { Component, ViewChild  } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { RecommenderPage } from '../recommender/recommender';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild("myTabs") tabRef: Tabs;

  tab1Root = RecommenderPage;
  tab2Root = ProfilePage;

  constructor() {

  }

  selectProfilePage(){
    this.tabRef.select(1);
  }
  selectRecommenderPage(){
    this.tabRef.select(2);
  }
}

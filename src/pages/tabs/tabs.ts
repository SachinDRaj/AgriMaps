import { Component } from '@angular/core';

import { RecommenderPage } from '../recommender/recommender';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RecommenderPage;
  tab2Root = ProfilePage;

  constructor() {

  }
}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecommenderMenuPage } from './recommender-menu';

@NgModule({
  declarations: [
    RecommenderMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(RecommenderMenuPage),
  ],
})
export class RecommenderMenuPageModule {}

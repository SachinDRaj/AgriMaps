import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LegendModalPage } from './legend-modal';

@NgModule({
  declarations: [
    LegendModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LegendModalPage),
  ],
})
export class LegendModalPageModule {}

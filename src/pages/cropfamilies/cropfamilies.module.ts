import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropfamiliesPage } from './cropfamilies';

@NgModule({
  declarations: [
    CropfamiliesPage,
  ],
  imports: [
    IonicPageModule.forChild(CropfamiliesPage),
  ],
})
export class CropfamiliesPageModule {}

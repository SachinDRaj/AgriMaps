import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InitialisationPage } from './initialisation';

@NgModule({
  declarations: [
    InitialisationPage,
  ],
  imports: [
    IonicPageModule.forChild(InitialisationPage),
  ],
})
export class InitialisationPageModule {}

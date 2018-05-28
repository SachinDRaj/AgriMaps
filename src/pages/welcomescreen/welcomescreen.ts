import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-welcomescreen',
  templateUrl: 'welcomescreen.html',
})
export class WelcomescreenPage {

  @ViewChild(Slides) slides: Slides;

  private buttonText: string;
  private buttonText1: string;
  private checkHide = true;
  private checkHide1 = false;

  slides1 = [
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
    this.buttonText = "Next";
    this.buttonText1 = "Previous";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomescreenPage');
  }

  slideChanged(){
    let currentIndex = this.slides.getActiveIndex();

    if(currentIndex === 0){
      this.buttonText = "Next";
      this.checkHide = true;
      this.checkHide1 = false;
    }else if(currentIndex === 1){
      this.buttonText = "Next";
      this.checkHide = false;
      this.checkHide1 = false;
    }else if(currentIndex === 2){
      this.buttonText = "Next";
      this.checkHide = false;
      this.checkHide1 = false;
    }else if(currentIndex === 3){
      this.buttonText = "Next";
      this.checkHide = false;
      this.checkHide1 = false;
    }else if(currentIndex === 4){
      this.buttonText = "Ready";
      this.checkHide = false;
      this.checkHide1 = true;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  nextSlide(){
    this.slides.slideNext();
  }

  previousSlide(){
    this.slides.slidePrev();
  }

}

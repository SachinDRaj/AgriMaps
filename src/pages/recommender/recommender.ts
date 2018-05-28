import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { RecommenderMenuPage } from '../recommender-menu/recommender-menu';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

declare var google: any;

@Component({
  selector: 'page-recommender',
  templateUrl: 'recommender.html'
})
export class RecommenderPage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  dUrl = 'http://mcc.lab.tt:8000/';
  ctaLayer: any;
  subtitle = "Tomatoes";
  latitude = 10.641046689163778;
  longitude = -61.40023168893231;
  catUrl = 'recommendTomato';
  radius = 1000;
  name: any;
  desc: any;
  infowindow: any;
  infoCheck = false;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public toastCtrl: ToastController,public loadingCtrl: LoadingController,public alertCtrl: AlertController,public geolocation: Geolocation) {

  }

  ionViewDidEnter(){
    let toast = this.toastCtrl.create({
            message: 'Now in Recommender Mode',
            duration: 1000,
            position: 'middle'
            // cssClass: "toastAfterHeader"
        });
    toast.present();
  }

  ionViewDidLoad() {
    this.showmap();
  }

  presentConfirm(lat,lng) {
    var entireUrl;
    let alert = this.alertCtrl.create({
      title: 'Change Location',
      message: 'Would you like to set this location as the new point of interest?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            this.generateMap(this.catUrl,this.radius,this.subtitle,lat,lng);
          }
        }
      ]
    });
    alert.present();
  }

  showmap(){

      let mapOptions = {
        center: {lat: 10.536421, lng: -61.311951},
        zoom: 10,
        zoomControl: true,
        fullscreenControl:false,
        disableDoubleClickZoom: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);

      // var marker = new google.maps.Marker({
      //     position: {lat: 10.536421, lng: -61.311951},
      // });
      //
      // marker.setMap(this.map);
      //
      // marker.addListener('click', function() {
      //     infowindow.open(this.map, marker);
      // });

      this.useCurrentLocation(0);

      this.map.addListener('dblclick', (event)=>{
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
        this.presentConfirm(event.latLng.lat(),event.latLng.lng());
      });

  }

  descriptionBuilder(des){
    var desc = "";
    var phStatus = "";
    if (des[0].localeCompare("3")==0) {
      phStatus = "Soil is too Alkaline";
    }else if (des[0].localeCompare("1")==0){
      phStatus = "Soil is too Acidic"
    }else{
      phStatus = "Soil pH is Optimal";
    }

    // var ecStatus = "";
    // if (des[1].localeCompare("3")==0) {
    //   ecStatus = "<br>EC is higher than Optimal";
    // }else if (des[1].localeCompare("1")==0){
    //   ecStatus = "<br>EC is lower than Optimal"
    // }else{
    //   ecStatus = "<br>EC is Optimal";
    // }

    var scStatus = "";
    if ( parseFloat(des[9])<parseFloat(des[10]) && parseFloat(des[9])>parseFloat(des[11])){
      scStatus = "<br>Soil composition is Optimal";
    }else if (des[2].localeCompare("3")==0) {
      scStatus = "<br>Soil composition is not ideal";
    }else if (des[2].localeCompare("1")==0){
      scStatus = "<br>Soil composition is not ideal"
    }else{
      scStatus = "<br>Soil composition is Optimal";
    }

    var rainStatus = "";
    if (des[3].localeCompare("3")==0) {
      rainStatus = "<br>There is too much Rainfall";
    }else if (des[3].localeCompare("1")==0){
      rainStatus = "<br>There is insufficient Rainfall"
    }else{
      rainStatus = "<br>Rainfall amount is Optimal";
    }

    desc = phStatus+scStatus+rainStatus;
    return desc;
  }


  useCurrentLocation(check){
    var contentString;
    var entireUrl;
    let loader = this.loadingCtrl.create({
      content: "Determing your location and generating map....",
      spinner: 'bubbles',
    });
    loader.present();

    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      entireUrl = this.dUrl+this.catUrl+"/"+this.longitude+"&"+this.latitude+"&"+this.radius;
      if (check == 1 && this.ctaLayer!=null){
        if (this.infoCheck == true){
          this.infowindow.close();
          this.infoCheck = false;
        }
        this.ctaLayer.setMap(null);
      }
      this.ctaLayer = new google.maps.KmlLayer({
          url: entireUrl,
          suppressInfoWindows: true
      });
      this.ctaLayer.setMap(this.map);

      this.ctaLayer.addListener('click', (kmlEvent)=>{
        if (this.infoCheck == true){
          this.infowindow.close();
          this.infoCheck = false;
        }
        this.desc = kmlEvent.featureData.description;
        this.name = kmlEvent.featureData.name;
        var des = this.desc.split(',');
        var description = this.descriptionBuilder(des);
        console.log(this.desc);
        // console.log(this.name);

        let contentString1 = '<div>'+
            '<h5 id="firstHeading" class="firstHeading">'+this.name+'</h5>'+
            '<p>'+description+'</p>'+
            '<button id="tap">View Recommendation</button>'+
            '</div>';

        let contentString2 = '<div>'+
            '<h5 id="firstHeading" class="firstHeading">'+this.name+'</h5>'+
            '<p>'+description+'</p>'+
            '<button id="tap" hidden>View Recommendation</button>'+
            '</div>';

        if (parseInt(des[0])==2 && parseInt(des[2])==2 && parseInt(des[3])==2){
          contentString = contentString2;
        }else contentString = contentString1;

        this.infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        this.infowindow.setPosition({lat: kmlEvent.latLng.lat(), lng: kmlEvent.latLng.lng()});
        this.infowindow.open(this.map);
        this.infoCheck = true;

        google.maps.event.addListenerOnce(this.infowindow, 'domready', () => {
          document.getElementById('tap').addEventListener('click', () => {
            console.log("touch");
            this.presentRecommendation(this.determineRecommendation(des));
          });
        });
      });
      loader.dismiss();
    }, (err) => {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'No Internet Connection',
        message: 'Please try again when you have an Internet Connection or Mobile Data.',
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
            handler: () => {
              console.log('Close');
            }
          }
        ]
      });
      alert.present();
      console.log(err);
    });

  }

  determineRecommendation(des){
    var info="";
    var phCheck = 0;
    var highErain = 0;
    var lowErain = 0;
    //soil pH
    if (parseFloat(des[5])>parseFloat(des[4])){
      info+="Soil is too Alkaline.The actual pH is "+des[5]+" while the recommended range is "+des[6]+"-"+des[4]+". Seek professional assistance on this issue.";
      phCheck = 1;
    }else if(parseFloat(des[5])<parseFloat(des[6])){
      info+="Soil is too Acidic.The actual pH is "+des[5]+" while the recommended range is "+des[6]+"-"+des[4]+". To raise the pH of the soil, do a lime requirement test and apply lime.";
      phCheck = 1;
    }else{
      //do nothing
    }

    //soil composition
    if (parseFloat(des[9])>parseFloat(des[10])){
      if(phCheck == 1){
        info+="<br><br>";
      }
      info+="The soil is made up of "+des[9]+"% Clay which is more than the recommended amount of "+des[10]+"%. Install drainage channels to improve composition";
      phCheck = 1;
    }else if(parseFloat(des[9])<parseFloat(des[11])){
      if(phCheck == 1){
        info+="<br><br>";
      }
      // console.log(parseFloat(des[9])>parseFloat(des[11]));
      info+="The soil is made up of "+des[9]+"% Clay which is less that the recommended amount of "+des[11]+"%. Irrigate soil to maintain adequate moisture.";
      phCheck = 1;
    }else{
      // do nothing
    }

    // determine expected Rainfall
    if(des[14]==1){
      highErain = 1998;
      lowErain = 1716;
    }else if(des[14]==2){
      highErain = 2166;
      lowErain = 1999;
    }else if(des[14]==3){
      highErain = 2310;
      lowErain = 2167;
    }else if(des[14]==4){
      highErain = 2478;
      lowErain = 2311;
    }else{
      highErain = 2700;
      lowErain = 2479;
    }
    //Rainfall
    if (lowErain>parseFloat(des[12])){
      if(phCheck == 1){
        info+="<br><br>";
      }
      info+="There is too much Annual Rainfall at this location. Expected Rainfall: "+lowErain+"-"+highErain+"mm vs Recommended Rainfall for this crop: "+des[13]+"-"+des[12]+"mm. Install appropriate drainage to improve water flow.";
    }else if(highErain<parseFloat(des[13])){
      if(phCheck == 1){
        info+="<br><br>";
      }
      info+="There is too little Annual Rainfall at this location. Expected Rainfall: "+lowErain+"-"+highErain+"mm vs Recommended Rainfall for this crop: "+des[13]+"-"+des[12]+"mm. Install an irrigation system.";
    }else{
      //do nothing
    }

    return info;
  }

  presentRecommendation(info){
    let alert = this.alertCtrl.create({
      title: 'Recommendation',
      message: info,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  openRMenu(){

    let modal = this.modalCtrl.create(RecommenderMenuPage,{param1: this.radius});
    modal.onDidDismiss(data=> {
      // console.log(data);
      if (data.subtitle == 1 ){
        data.subtitle = "All Crops"
        this.generateAllMap(data.catUrl,data.rad,data.subtitle,this.latitude,this.longitude);
      }else
      if (data.catUrl != 0 ){
        this.generateMap(data.catUrl,data.rad,data.subtitle,this.latitude,this.longitude);
      }

    });
    modal.present();
  }

  generateMap(catUrl,rad,subtitle,lat,lng){
    var contentString;
    var entireUrl;
    let loader = this.presentLoader();
    this.catUrl = catUrl;
    this.radius = rad;
    this.longitude = lng;
    this.latitude = lat;
    entireUrl= this.dUrl+catUrl+"/"+this.longitude+"&"+this.latitude+"&"+rad;
    console.log(entireUrl);
    this.subtitle = subtitle;

    if (this.infoCheck == true){
      this.infowindow.close();
      this.infoCheck = false;
    }
    this.ctaLayer.setMap(null);
    this.ctaLayer = new google.maps.KmlLayer({
        url: entireUrl,
        suppressInfoWindows: true
    });
    this.ctaLayer.setMap(this.map);

    this.ctaLayer.addListener('click', (kmlEvent)=>{
      if (this.infoCheck == true){
        this.infowindow.close();
        this.infoCheck = false;
      }
      var pm = kmlEvent.featureData;
      console.log(pm);

      this.desc = kmlEvent.featureData.description;
      this.name = kmlEvent.featureData.name;
      var des = this.desc.split(',');
      var description = this.descriptionBuilder(des);
      console.log(this.desc);
      // console.log(this.name);

      let contentString1 = '<div>'+
          '<h5 id="firstHeading" class="firstHeading">'+this.name+'</h5>'+
          '<p>'+description+'</p>'+
          '<button id="tap">View Recommendation</button>'+
          '</div>';

      let contentString2 = '<div>'+
          '<h5 id="firstHeading" class="firstHeading">'+this.name+'</h5>'+
          '<p>'+description+'</p>'+
          '<button id="tap" hidden>View Recommendation</button>'+
          '</div>';

      if (parseInt(des[0])==2 && parseInt(des[2])==2 && parseInt(des[3])==2){
        contentString = contentString2;
      }else contentString = contentString1;

      this.infowindow = new google.maps.InfoWindow({
          content: contentString
      });

      this.infowindow.setPosition({lat: kmlEvent.latLng.lat(), lng: kmlEvent.latLng.lng()});
      this.infowindow.open(this.map);
      this.infoCheck = true;

      google.maps.event.addListenerOnce(this.infowindow, 'domready', () => {
        document.getElementById('tap').addEventListener('click', () => {
          console.log("touch");
          this.presentRecommendation(this.determineRecommendation(des));
        });
      });

    });

    this.dismissLoader(loader);
  }

  generateAllMap(catUrl,rad,subtitle,lat,lng){
    var entireUrl;
    let loader = this.presentLoader();
    this.catUrl = catUrl;
    this.radius = rad;
    this.longitude = lng;
    this.latitude = lat;
    entireUrl= this.dUrl+catUrl+"/"+this.longitude+"&"+this.latitude+"&"+rad;
    console.log(entireUrl);
    this.subtitle = subtitle;
    this.ctaLayer.setMap(null);
    this.ctaLayer = new google.maps.KmlLayer({
        url: entireUrl,
    });
    this.ctaLayer.setMap(this.map);

    this.dismissLoader(loader);
  }

  presentLoader(){
    let loader = this.loadingCtrl.create({
      content: "Loading Map...",
      spinner: 'bubbles',
    });
    loader.present();
    return loader;
  }

  dismissLoader(loader){
    setTimeout(() => {
      loader.dismiss();
    }, 1000);
  }

  openRecommendation(){
    console.log("hello im working");
  }

}
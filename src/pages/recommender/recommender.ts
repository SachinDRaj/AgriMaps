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

    var ecStatus = "";
    if (des[1].localeCompare("3")==0) {
      ecStatus = "<br>EC is higher than Optimal";
    }else if (des[1].localeCompare("1")==0){
      ecStatus = "<br>EC is lower than Optimal"
    }else{
      ecStatus = "<br>EC is Optimal";
    }

    var scStatus = "";
    if (des[2].localeCompare("3")==0) {
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

    desc = phStatus+ecStatus+scStatus+rainStatus;
    return desc;
  }


  useCurrentLocation(check){
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
      if (check == 1)
        this.ctaLayer.setMap(null);
      this.ctaLayer = new google.maps.KmlLayer({
          url: entireUrl,
          suppressInfoWindows: true
      });
      this.ctaLayer.setMap(this.map);

      this.ctaLayer.addListener('click', (kmlEvent)=>{

        this.desc = kmlEvent.featureData.description;
        this.name = kmlEvent.featureData.name;
        var des = this.desc.split(',');
        var description = this.descriptionBuilder(des);
        console.log(this.desc);
        // console.log(this.name);

        var contentString = '<div>'+
            '<h5 id="firstHeading" class="firstHeading">'+this.name+'</h5>'+
            '<p>'+description+'</p>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        infowindow.setPosition({lat: kmlEvent.latLng.lat(), lng: kmlEvent.latLng.lng()});
        infowindow.open(this.map);

      });

      loader.dismiss();
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });

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
        suppressInfoWindows: true
    });
    this.ctaLayer.setMap(this.map);

    this.ctaLayer.addListener('click', (kmlEvent)=>{

      this.desc = kmlEvent.featureData.description;
      this.name = kmlEvent.featureData.name;
      var des = this.desc.split(',');
      var description = this.descriptionBuilder(des);
      console.log(this.desc);
      // console.log(this.name);

      var contentString = '<div>'+
          '<h5 id="firstHeading" class="firstHeading">'+this.name+'</h5>'+
          '<p>'+description+'</p>'+
          '</div>';

      var infowindow = new google.maps.InfoWindow({
          content: contentString
      });

      infowindow.setPosition({lat: kmlEvent.latLng.lat(), lng: kmlEvent.latLng.lng()});
      infowindow.open(this.map);

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

}
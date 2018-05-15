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
            let loader = this.loadingCtrl.create({
              content: "Loading Map...",
              spinner: 'bubbles',
            });
            loader.present();
            this.latitude = lat;
            this.longitude = lng;
            entireUrl = this.dUrl+this.catUrl+"/"+this.longitude+"&"+this.latitude+"&"+this.radius;
            this.ctaLayer.setMap(null);
            this.ctaLayer = new google.maps.KmlLayer({
                url: entireUrl,
            });
            this.ctaLayer.setMap(this.map);
            loader.dismiss();
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

      // marker.setMap(this.map);

      this.ctaLayer = new google.maps.KmlLayer({
          url:'http://mcc.lab.tt:8000/recommendTomato/-61.40023168893231&10.641046689163778&1000',
      });

      this.ctaLayer.setMap(this.map);

      this.map.addListener('dblclick', (event)=>{
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
        this.presentConfirm(event.latLng.lat(),event.latLng.lng());
      });

  }

  useCurrentLocation(){
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
      this.ctaLayer.setMap(null);
      this.ctaLayer = new google.maps.KmlLayer({
          url: entireUrl,
      });
      this.ctaLayer.setMap(this.map);
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
    // var lng = -61.40023168893231;
    // var lat = 10.641046689163778;
    var entireUrl;
    let modal = this.modalCtrl.create(RecommenderMenuPage);
    modal.onDidDismiss(data=> {
      // console.log(data);
      if (data.catUrl != 0 ){
        let loader = this.loadingCtrl.create({
          content: "Loading Map...",
          spinner: 'bubbles',
        });
        loader.present();
        entireUrl= this.dUrl+data.catUrl+"/"+this.longitude+"&"+this.latitude+"&"+data.rad;
        console.log(entireUrl);
        this.subtitle = data.subtitle;
        this.ctaLayer.setMap(null);
        this.ctaLayer = new google.maps.KmlLayer({
            url: entireUrl,
            // url:'http://mcc.lab.tt:8000/recommendLettuce/-61.40023168893231&10.641046689163778&1000',
        });

        this.ctaLayer.setMap(this.map);
        loader.dismiss();
      }
    });
    modal.present();
  }

}

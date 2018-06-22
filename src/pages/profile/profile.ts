import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { ProfileMenuPage } from '../profile-menu/profile-menu';
import { LegendModalPage } from '../legend-modal/legend-modal';
import { SettingsPage } from '../settings/settings';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Firebase } from '@ionic-native/firebase';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

declare var google: any;
declare var navigator: any;
declare var Connection: any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  // dUrl = 'http://mcc.lab.tt:8000/';
  dUrl ='http://64.28.140.203/agrimaps/';
  ctaLayer: any;
  subtitle = "Soil Series";
  latitude = 10.641046689163778;
  longitude = -61.40023168893231;
  catUrl = 'soilCapability';
  radius = 1000;
  isValid = true;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public toastCtrl: ToastController,public loadingCtrl: LoadingController,public alertCtrl: AlertController,public geolocation: Geolocation, public platform: Platform,public network: Network,private firebase: Firebase,private nativeGeocoder: NativeGeocoder) {
    // this.locFrom = this.navParams.get('param1');
    // this.navCtrl.push(LoginPage,{param1: 0});
    firebase.logEvent(this.subtitle, {content_type: "page_view", item_id: this.catUrl});
  }

  ionViewDidEnter(){
    let toast = this.toastCtrl.create({
            message: 'Now in Land Profile Mode',
            duration: 1000,
            position: 'middle'
            // cssClass: "toastAfterHeader"
        });
    toast.present();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.showmap();
    });
  }

  presentConfirm(lat,lng) {
    var entireUrl;
    this.firebase.logEvent("changeLocation", {content_type: "page_view", item_id: "changeLocation"});

    this.nativeGeocoder.reverseGeocode(lat, lng)
      .then((result: NativeGeocoderReverseResult) => {
        // console.log(JSON.stringify(result));
        var cc = JSON.stringify(result[0].countryCode);
        // console.log(cc);
        if (cc.localeCompare('"TT"')==0){
          let alert = this.alertCtrl.create({
            title: 'Change Location?',
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
                  let loader = this.presentLoader();
                  this.latitude = lat;
                  this.longitude = lng;
                  entireUrl = this.dUrl+this.catUrl+"/"+this.longitude+"&"+this.latitude+"&"+this.radius;
                  try {
                    this.ctaLayer.setMap(null);
                  }catch(error){
                    console.log(error);
                  }

                  this.ctaLayer = new google.maps.KmlLayer({
                      url: entireUrl,
                  });
                  this.checkNetwork(this.ctaLayer);
                  this.dismissLoader(loader);
                }
              }
            ]
          });
          alert.present();
        }else{
          let alert = this.alertCtrl.create({
            title: 'Out of Region!',
            message: 'AgriMaps only generates data within Trinidad.',
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
        }
      })
      .catch((error: any) => console.log(error));

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
      this.useCurrentLocation(0);

      this.map.addListener('dblclick', (event)=>{
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
        this.presentConfirm(event.latLng.lat(),event.latLng.lng());
      });

  }

  useCurrentLocation(check){
    var entireUrl;
    let loader = this.loadingCtrl.create({
      content: "Determing your location and generating map....",
      spinner: 'bubbles',
    });
    loader.present();

    this.firebase.logEvent("useLocation", {content_type: "page_view", item_id: "gpsLocation"});

    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude)
        .then((result: NativeGeocoderReverseResult) => {
          // console.log(JSON.stringify(result));
          var cc = JSON.stringify(result[0].countryCode);
          // console.log(cc);
          if (cc.localeCompare('"TT"')==0){
            entireUrl = this.dUrl+this.catUrl+"/"+this.longitude+"&"+this.latitude+"&"+this.radius;
            if (check == 1 && this.ctaLayer!=null){
              this.ctaLayer.setMap(null);
            }

            this.ctaLayer = new google.maps.KmlLayer({
                url: entireUrl,
            });
            // this.ctaLayer.setMap(this.map);
            this.checkNetwork(this.ctaLayer);
            loader.dismiss();
          }else{
            loader.dismiss();

            let alert = this.alertCtrl.create({
              title: 'Out of Region!',
              message: 'AgriMaps only generates data within Trinidad. You can use this application outside Trinidad, however, using gps location to generate map data for your region will not work.',
              buttons: [
                {
                  text: 'Close',
                  role: 'cancel',
                  handler: () => {
                    console.log('Close');
                    this.generateMap(this.catUrl,this.radius,this.subtitle,10.641046689163778,-61.40023168893231);
                  }
                }
              ]
            });
            alert.present();
          }
        })
        .catch((error: any) => console.log(error));

    }, (err) => {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Location Services is turned off!',
        message: 'Please turn on Location Services for this application.',
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
            handler: () => {
              console.log('Close');
              // this.generateMap(this.catUrl,this.radius,this.subtitle,this.latitude,this.longitude);
            }
          }
        ]
      });
      alert.present();
      console.log(err);
    });

  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  openPMenu(){
    // var lng = -61.40023168893231;
    // var lat = 10.641046689163778;
    var entireUrl;
    let modal = this.modalCtrl.create(ProfileMenuPage,{param1: this.radius});
    modal.onDidDismiss(data=> {
      // console.log(data);
      if (data.catUrl != 0 ){

        if (data.catUrl.localeCompare("soilCapability")==0 || data.catUrl.localeCompare("rainfall")==0 || data.catUrl.localeCompare("landUse")==0){
          this.isValid = true;
        }else{
          this.isValid = false;
        }

        let loader = this.presentLoader();
        this.catUrl = data.catUrl;
        this.radius = data.rad;
        entireUrl= this.dUrl+data.catUrl+"/"+this.longitude+"&"+this.latitude+"&"+data.rad;
        console.log(entireUrl);
        this.subtitle = data.subtitle;
        this.firebase.logEvent(this.subtitle, {content_type: "page_view", item_id: this.catUrl});
        try {
          this.ctaLayer.setMap(null);
        }catch(error){
          console.log(error);
        }
        this.ctaLayer = new google.maps.KmlLayer({
            url: entireUrl,
            // url:'http://mcc.lab.tt:8000/recommendLettuce/-61.40023168893231&10.641046689163778&1000',
        });
        // this.ctaLayer.setMap(this.map);
        this.checkNetwork(this.ctaLayer);
        // google.maps.event.addListener(this.ctaLayer, 'status_changed', function () {
        //     if (this.ctaLayer.getStatus() == google.maps.KmlLayerStatus.OK) {
        //         alert("hi");
        //     }
        //     else {
        //         alert("die");
        //     }
        // });

        this.dismissLoader(loader);
      }
    });
    modal.present();
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

  openLegend(){
    if (this.catUrl.localeCompare("soilCapability")==0){
      let modal = this.modalCtrl.create(LegendModalPage,{param1: this.catUrl});
      modal.present();
    }else if (this.catUrl.localeCompare("rainfall")==0){
      let modal = this.modalCtrl.create(LegendModalPage,{param1: this.catUrl});
      modal.present();
    }else if (this.catUrl.localeCompare("landUse")==0){
      let modal = this.modalCtrl.create(LegendModalPage,{param1: this.catUrl});
      modal.present();
    }else{
      //do nothing
    }
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
    try {
      this.ctaLayer.setMap(null);
    }catch(error){
      console.log(error);
    }
    this.ctaLayer = new google.maps.KmlLayer({
        url: entireUrl,
    });

    this.checkNetwork(this.ctaLayer);

    this.dismissLoader(loader);
  }

  checkNetwork(ctalayer) {
     this.platform.ready().then(() => {
         var networkState = navigator.connection.type;
         var states = {};
         states[Connection.UNKNOWN]  = 'Unknown connection';
         states[Connection.ETHERNET] = 'Ethernet connection';
         states[Connection.WIFI]     = 'WiFi connection';
         states[Connection.CELL_2G]  = 'Cell 2G connection';
         states[Connection.CELL_3G]  = 'Cell 3G connection';
         states[Connection.CELL_4G]  = 'Cell 4G connection';
         states[Connection.CELL]     = 'Cell generic connection';
         states[Connection.NONE]     = 'No network connection';
         console.log(states[networkState]);
         if (states[networkState]=='No network connection'){
           let alert = this.alertCtrl.create({
             title: 'No Internet Connection or Mobile Data!',
             message: 'Please try again when you have an Internet Connection/Mobile Data',
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
         }else{
           ctalayer.setMap(this.map);
         }
     });
   }

}
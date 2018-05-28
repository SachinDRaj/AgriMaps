import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { ProfileMenuPage } from '../profile-menu/profile-menu';
import { LegendModalPage } from '../legend-modal/legend-modal';
import { SettingsPage } from '../settings/settings';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

declare var google: any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  dUrl = 'http://mcc.lab.tt:8000/';
  ctaLayer: any;
  subtitle = "Soil Series";
  latitude = 10.641046689163778;
  longitude = -61.40023168893231;
  catUrl = 'soilCapability';
  radius = 1000;
  isValid = true;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public toastCtrl: ToastController,public loadingCtrl: LoadingController,public alertCtrl: AlertController,public geolocation: Geolocation) {
    // this.locFrom = this.navParams.get('param1');
    // this.navCtrl.push(LoginPage,{param1: 0});
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
            let loader = this.presentLoader();
            this.latitude = lat;
            this.longitude = lng;
            entireUrl = this.dUrl+this.catUrl+"/"+this.longitude+"&"+this.latitude+"&"+this.radius;
            this.ctaLayer.setMap(null);
            this.ctaLayer = new google.maps.KmlLayer({
                url: entireUrl,
            });
            this.ctaLayer.setMap(this.map);
            this.dismissLoader(loader);
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
      this.useCurrentLocation(0);
      // this.ctaLayer = new google.maps.KmlLayer({
      //     url:'http://mcc.lab.tt:8000/soilCapability/-61.40023168893231&10.641046689163778&1000',
      // });
      //
      // this.ctaLayer.setMap(this.map);
      //
      // this.ctaLayer.addListener('click', function(kmlEvent) {
      //   var text = kmlEvent.featureData.description;
      //   var name = kmlEvent.featureData.name;
      //   console.log(text);
      //   console.log(name);
      // });

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

    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      entireUrl = this.dUrl+this.catUrl+"/"+this.longitude+"&"+this.latitude+"&"+this.radius;
      if (check == 1 && this.ctaLayer!=null){
        this.ctaLayer.setMap(null);
      }
      this.ctaLayer = new google.maps.KmlLayer({
          url: entireUrl,
      });
      this.ctaLayer.setMap(this.map);
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
        this.ctaLayer.setMap(null);
        this.ctaLayer = new google.maps.KmlLayer({
            url: entireUrl,
            // url:'http://mcc.lab.tt:8000/recommendLettuce/-61.40023168893231&10.641046689163778&1000',
        });
        this.ctaLayer.setMap(this.map);

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

}
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ToastController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public toastCtrl: ToastController,public navParams: NavParams) {

  }

  ionViewDidEnter(){
    let toast = this.toastCtrl.create({
            message: 'Now in Recommender Mode',
            duration: 1000,
            position: 'top'
        });
    toast.present();
  }

  ionViewDidLoad() {
    this.showmap();
  }

  showmap(){
    // this.geolocation.getCurrentPosition().then((position) => {

      // let latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

      let mapOptions = {
        center: {lat: 10.536421, lng: -61.311951},
        zoom: 10,
        zoomControl: true,
        fullscreenControl:false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
      //
      // var triangleCoords = [
      //   {lat: 25.774, lng: -80.190},
      //   {lat: 18.466, lng: -66.118},
      //   {lat: 32.321, lng: -64.757},
      //   {lat: 25.774, lng: -80.190}
      // ];

      // Construct the polygon.
      // var bermudaTriangle = new google.maps.Polygon({
      //   paths: triangleCoords,
      //   strokeColor: '#FF0000',
      //   strokeOpacity: 0.8,
      //   strokeWeight: 2,
      //   fillColor: '#FF0000',
      //   fillOpacity: 0.35
      // });
      // bermudaTriangle.setMap(this.map);

      // var marker = new google.maps.Marker({
      //     position: {lat: 10.536421, lng: -61.311951},
      // });

      // marker.setMap(this.map);

      this.ctaLayer = new google.maps.KmlLayer({
          url:'http://mcc.lab.tt:8000/recommendTomato/-61.40023168893231&10.641046689163778&1000',
      });

      this.ctaLayer.setMap(this.map);


    // }, (err) => {
    //   console.log(err);
    // });

    // const location = new google.maps.LatLng(10.536421,-61.311951); trinidad coordinates


  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  openRMenu(){
    var lng = -61.40023168893231;
    var lat = 10.641046689163778;
    var entireUrl;
    let modal = this.modalCtrl.create(RecommenderMenuPage);
    modal.onDidDismiss(data=> {
      console.log(data);
      if (data.catUrl != 0 ){
        entireUrl= this.dUrl+data.catUrl+"/"+lng+"&"+lat+"&"+data.rad;
        console.log(entireUrl);
        this.subtitle = data.subtitle;
        this.ctaLayer.setMap(null);
        this.ctaLayer = new google.maps.KmlLayer({
            url: entireUrl,
            // url:'http://mcc.lab.tt:8000/recommendLettuce/-61.40023168893231&10.641046689163778&1000',
        });

        this.ctaLayer.setMap(this.map);
      }
    });
    modal.present();
  }

}

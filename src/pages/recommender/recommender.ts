import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,public modalCtrl: ModalController) {

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

      var triangleCoords = [
        {lat: 25.774, lng: -80.190},
        {lat: 18.466, lng: -66.118},
        {lat: 32.321, lng: -64.757},
        {lat: 25.774, lng: -80.190}
      ];

      // Construct the polygon.
      var bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
      bermudaTriangle.setMap(this.map);

      var marker = new google.maps.Marker({
          position: {lat: 10.536421, lng: -61.311951},
      });

      marker.setMap(this.map);

      // var ctaLayer = new google.maps.KmlLayer({
      //     url:'https://sites.google.com/site/agrimapskml/dockml/doc.kml?attredirects=0&d=1',
      // });
      //
      // ctaLayer.setMap(this.map);


    // }, (err) => {
    //   console.log(err);
    // });

    // const location = new google.maps.LatLng(10.536421,-61.311951); trinidad coordinates


  }

  openSettings(){
    this.navCtrl.push(SettingsPage);
  }

  openRMenu(){
    let modal = this.modalCtrl.create(RecommenderMenuPage);
    modal.present();
  }

}

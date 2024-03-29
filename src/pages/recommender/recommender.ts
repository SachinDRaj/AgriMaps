import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { RecommenderMenuPage } from '../recommender-menu/recommender-menu';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Firebase } from '@ionic-native/firebase';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

declare var google: any;
declare var navigator: any;
declare var Connection: any;

@Component({
  selector: 'page-recommender',
  templateUrl: 'recommender.html'
})
export class RecommenderPage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  // dUrl = 'http://mcc.lab.tt:8000/';
  dUrl ='http://64.28.140.203/agrimaps/';
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

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public toastCtrl: ToastController,public loadingCtrl: LoadingController,public alertCtrl: AlertController,public geolocation: Geolocation,public platform: Platform,private firebase: Firebase,public network: Network,private nativeGeocoder: NativeGeocoder) {
    firebase.logEvent(this.subtitle, {content_type: "page_view", item_id: this.catUrl});
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
                  this.generateMap(this.catUrl,this.radius,this.subtitle,lat,lng);
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
            // this.ctaLayer.setMap(this.map);
            this.checkNetwork(this.ctaLayer);

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
                  '<button type="button" class="gbutton" id="tap">View Recommendation</button>'+
                  '</div>';

              let contentString2 = '<div>'+
                  '<h5 id="firstHeading" class="firstHeading">'+this.name+'</h5>'+
                  '<p>'+description+'</p>'+
                  '<button type="button" class="gbutton" id="tap" hidden>View Recommendation</button>'+
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
    this.firebase.logEvent(this.subtitle, {content_type: "page_view", item_id: this.catUrl});
    if (this.infoCheck == true){
      this.infowindow.close();
      this.infoCheck = false;
    }
    try {
      this.ctaLayer.setMap(null);
    }catch(error){
      console.log(error);
    }
    this.ctaLayer = new google.maps.KmlLayer({
        url: entireUrl,
        suppressInfoWindows: true
    });
    // this.ctaLayer.setMap(this.map);
    this.checkNetwork(this.ctaLayer);

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
          '<button type="button" class="gbutton" id="tap">View Recommendation</button>'+
          '</div>';

      let contentString2 = '<div>'+
          '<h5 id="firstHeading" class="firstHeading">'+this.name+'</h5>'+
          '<p>'+description+'</p>'+
          '<button type="button" class="gbutton" id="tap" hidden>View Recommendation</button>'+
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
    this.firebase.logEvent(this.subtitle, {content_type: "page_view", item_id: this.catUrl});
    try {
      this.ctaLayer.setMap(null);
    }catch(error){
      console.log(error);
    }
    this.ctaLayer = new google.maps.KmlLayer({
        url: entireUrl,
    });
    // this.ctaLayer.setMap(this.map);
    this.checkNetwork(this.ctaLayer);

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
// Base import
import { Component } from '@angular/core';
import { NavController, Platform, NavParams, Page, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Plugin import
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, Toast, GoogleMapsMarkerOptions, GoogleMapsMarker, GoogleMapsMarkerIcon, Splashscreen, } from 'ionic-native';
import { Geoposition, GeolocationOptions } from 'ionic-native/dist/plugins/geolocation';

// Page import
import { TabPage } from '../tab/tab';
import { CheckPage } from '../check/check';
import { LuckyPage } from '../../pages/lucky/lucky';

@Component({
    templateUrl: 'build/pages/map/map.html'
})

export class MapPage {
    constructor(private http: Http, private platform: Platform, private navController: NavController) {
        
    }

    onPageLoaded() {
        this.platform.ready().then(() => {
            this.initializeMap()
        })
    }

    public initializeMap() {

        this.http.get('http://loto.halogi.com/store').map(res => res.json()).subscribe(data => {

            console.log('http done');

            let map = new GoogleMap('map', {
                zoom: 15
            });
            
            map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
                map.setMyLocationEnabled(true);
                map.setZoom(15);


                // let options: GeolocationOptions = {
                //     maximumAge: 0, timeout: 5000, enableHighAccuracy: false
                // };

                Geolocation.getCurrentPosition().then((resp) => {
                    console.log('locate ready');
                    let lat = resp.coords.latitude;
                    let long = resp.coords.longitude;
                    let coord = new GoogleMapsLatLng(lat, long); // Current Position
                    map.animateCamera({
                        'target': coord,
                        'zoom': 18,
                    });
                    // Toast.show("Chọn một đại lý bán vé ở gần bạn và bắt đầu tham gia", '3000', 'bottom').subscribe(
                    //     toast => {
                    //     }
                    // );
                })

                addMarkers(data, function (markers) {
                    markers[markers.length - 1].showInfoWindow();
                });

                function addMarkers(data, callback) {
                    var markers = [];
                    function onMarkerAdded(marker) {
                        markers.push(marker);
                        if (markers.length === data.length) {
                            callback(markers);
                        }
                    }

                    data.forEach((element) => {
                        map.addMarker({
                            'position': new GoogleMapsLatLng(element.location.lat, element.location.lng),
                            'title': element.title
                        }).then(onMarkerAdded);
                    });
                }
            });

        });
    }

    public resultView() {
        this.navController.setRoot(TabPage);
    }
    
    public checkView() {
        this.navController.setRoot(CheckPage);
    }

    public luckyView() {
        this.navController.setRoot(LuckyPage);
    }
}
// Base import
import { Component } from '@angular/core';
import { NavController, Platform, NavParams, Page, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Plugin import
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, Toast, GoogleMapsMarkerOptions, GoogleMapsMarker, GoogleMapsMarkerIcon, Splashscreen, } from 'ionic-native';
import { Geoposition, GeolocationOptions } from 'ionic-native/dist/plugins/geolocation';

// Page import
import { MapPage } from '../../pages/map/map';
import { TabPage } from '../../pages/tab/tab';
import { CheckPage } from '../../pages/check/check';

@Component({
    templateUrl: 'build/pages/lucky/lucky.html'
})
export class LuckyPage {

    private store: any;

    constructor(private http: Http, private navController: NavController, private platform: Platform) { 

    }

    onPageLoaded() {
        GoogleMap.isAvailable().then((availabled) => {
            this.initializeMap()
        }, (notAvailable) => {
            Toast.show('Thiết bị của bạn không hỗ trợ bản đồ', '3000', 'center').subscribe(
                toast => {
                }
            );
        })
    }

    public initializeMap() {

        let map = new GoogleMap('luckyMap', {
            'zoom': 15,
            'controls': {
                'compass': true,
                'indoorPicker': true,
                'zoom': true
            },
        });

        map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            map.setCenter(new GoogleMapsLatLng(21.032316, 105.812963));
            map.setMyLocationEnabled(true);
            map.setZoom(15);

            Geolocation.getCurrentPosition().then((resp) => {
                let lat = resp.coords.latitude;
                let long = resp.coords.longitude;
                let coord = new GoogleMapsLatLng(lat, long); // Current Position
                map.animateCamera({
                    'target': coord,
                    'zoom': 18,
                    'duration': 2000
                });
            }, (error) => {
                Toast.show('Vui lòng kiểm tra lại tính năng định vị trên thiết bị của bạn', '3000', 'center').subscribe(
                    toast => {
                    }
                );
            })
        });

        map.on(GoogleMapsEvent.MAP_LOADED).subscribe(() => {
            this.http.get('http://loto.halogi.com/store_lucky').map(res => res.json()).subscribe((data) => {
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
    
            }, (error) => {
                Toast.show('Lỗi kết nối, vui lòng kiểm tra lại kết nối mạng', '3000', 'center').subscribe(
                    toast => {
                    }
                );
            });
        })

        
    }

    public mapView() {
        this.navController.setRoot(MapPage);
    }

    public checkView() {
        this.navController.setRoot(CheckPage);
    }

    public resultView() {
        this.navController.setRoot(TabPage);
    }

   
}
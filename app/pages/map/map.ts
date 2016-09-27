// Base import
import { Component } from '@angular/core';
import { NavController, Platform, NavParams, Page, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Plugin import
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, Toast, GoogleMapsMarkerOptions, GoogleMapsMarker, GoogleMapsMarkerIcon, Splashscreen, LaunchNavigator, LaunchNavigatorOptions} from 'ionic-native';
import { Geoposition, GeolocationOptions } from 'ionic-native/dist/plugins/geolocation';

// Page import
import { TabPage } from '../tab/tab';
import { CheckPage } from '../check/check';
import { LuckyPage } from '../../pages/lucky/lucky';

@Component({
    templateUrl: 'build/pages/map/map.html',
    providers: [LaunchNavigator]
})

export class MapPage {

    private currentLat: any;
    private currentLng: any;

    constructor(private http: Http, private platform: Platform, private navController: NavController) {
        
    }

    onPageLoaded() {
        this.platform.ready().then(() => {
            GoogleMap.isAvailable().then((availabled) => {
                this.initializeMap()
            }, (notAvailable) => {
                Toast.show('Thiết bị của bạn không hỗ trợ bản đồ', '3000', 'center').subscribe(
                    toast => {
                    }
                );
            })
        })
    }

    public initializeMap() {

        let map = new GoogleMap('map', {
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
                this.currentLat = resp.coords.latitude;
                this.currentLng = resp.coords.longitude;
                let coord = new GoogleMapsLatLng(this.currentLat, this.currentLng); // Current Position
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
            this.http.get('http://loto.halogi.com/store').map(res => res.json()).subscribe((data) => {

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
                            'title': element.title,
                            'snippet' : 'Đến điểm bán này',
                        }).then(onMarkerAdded);
    
                        map.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                            console.log('test');
                            Geolocation.getCurrentPosition().then((resp) => {
                                this.currentLat = resp.coords.latitude;
                                this.currentLng = resp.coords.longitude;
                                LaunchNavigator.navigate([element.location.lat, element.location.lng], {
                                    start: this.currentLat + this.currentLng
                                });
                            }, (error) => {
                                Toast.show('Vui lòng kiểm tra lại tính năng định vị trên thiết bị của bạn', '3000', 'center').subscribe(
                                    toast => {
                                    }
                                );
                            })
                        })
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
// Base import
import { Component } from '@angular/core';
import { NavController, Platform, NavParams, Page, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Plugin import
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, Toast, GoogleMapsMarkerOptions, GoogleMapsMarker, GoogleMapsMarkerIcon, Splashscreen, DatePicker, SpinnerDialog } from 'ionic-native';
import { Geoposition, GeolocationOptions } from 'ionic-native/dist/plugins/geolocation';

// Services import
import { Helper } from '../../services/helper';

// Page import
import { ResultPage } from '../../pages/result/result';
import { PickPage } from '../../pages/pick/pick';

@Component({
    templateUrl: 'build/pages/tab/tab.html',
    providers: [Helper]
})
export class TabPage {

    private activePage: number = 2;
    private status: string;

    private curentDate: string;
    private currentResult: Array<string> = [];
    private showNewestResult: boolean = true;
    private dateParam: any;

    private store: any;

    constructor(private platform: Platform, private loadingCtrl: LoadingController, private helper: Helper, private http: Http, private navController: NavController, public modalCtrl: ModalController, private viewCtrl: ViewController, private navParms: NavParams) {
       
    }

    onPageLoaded() {
        this.getCurrentResult();
        let httpRequest = this.http.get('http://loto.halogi.com/store_lucky').map(res => res.json()).subscribe(data => {
            this.store = data;
            setTimeout(function() {
                httpRequest.unsubscribe();
            }, 2500);
        })
    }

    onPageWillEnter() {
        if (this.navParms.get('activePage') != undefined) {
            this.activePage = this.navParms.get('activePage');
        }
    }

    public tabIndex(No) {
        this.activePage = No;
        if (this.activePage == 1) {
            console.log(document.getElementById('map'));
            this.platform.ready().then(() => {
                this.initializeMap();
            });
        }
    }

    public commingSoon() {
        Toast.show("Tính năng này đang được phát triển", '2500', 'bottom').subscribe(
            toast => {
            }
        );
    }

    public resultPage() {
        this.navController.setRoot(ResultPage);
    }

    public initializeMap() {

        let map = new GoogleMap('map', {
            zoom: 15
        });


        this.http.get('http://loto.halogi.com/store').map(res => res.json()).subscribe(data => {
            
            map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
                map.setMyLocationEnabled(true);
                map.setZoom(15);


                let options: GeolocationOptions = {
                    maximumAge: 0, timeout: 5000, enableHighAccuracy: false
                };

                Geolocation.getCurrentPosition(options).then((resp) => {
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

    public picker() {
        this.platform.ready().then(() => {
             DatePicker.show({
                date: new Date(),
                mode: 'date',
                okText: 'Chọn',
                cancelText: 'Thoát',
                androidTheme: 5,
            }).then((date) => {

                this.curentDate = '';
                this.curentDate = this.helper.formatNumber(date.getDate().toString()) + '-' + this.helper.formatNumber((date.getMonth() + 1).toString()) + '-' + date.getFullYear().toString()
                console.log(this.curentDate);

                let loader = this.loadingCtrl.create({
                    content: "Đang tải...",
                });
                loader.present();

                let dateStr = date.getFullYear().toString() + this.helper.formatNumber((date.getMonth() + 1).toString()) + this.helper.formatNumber(date.getDate().toString()); //Format lại định dạng ngày tháng
                // console.log(dateStr);
                this.dateParam = dateStr;
                let httpRequestListenner = this.http.get('http://loto.halogi.com/result?date=' + dateStr).map(res => res.json()).subscribe(
                    (data) => {
                        this.currentResult = []; // Xóa mảng ball kết quả trả về trước khi truyền vào dữ liệu mới
                        
                        this.showNewestResult = true;

                        data.jackpot.split(",").forEach(i => {
                            this.currentResult.push(this.helper.formatNumber(i));  // Format lại định dạng số trả về và truyền dữ liệu mới vào mảng
                        });

                        this.showNewestResult = false;

                        loader.dismiss();
                    },
                    (error) => {
                        console.log(error);
                        Toast.show('Không có kết quả quay số cho ngày này', '3000', 'center').subscribe(
                            toast => {
                                console.log(toast);
                            }
                        );
                        loader.dismiss();
                    }
                );

                this.navController.viewDidLeave.subscribe(() => {
                    console.log('view leave');
                    httpRequestListenner.unsubscribe();
                })
            })
        })
    }

    public getCurrentResult() {
        this.curentDate = this.helper.formatNumber(new Date().getDate().toString()) + '-' + this.helper.formatNumber((new Date().getMonth() + 1).toString()) + '-' + new Date().getFullYear().toString();
        let paramDate = new Date().getFullYear().toString() + this.helper.formatNumber((new Date().getMonth() + 1).toString()) + this.helper.formatNumber(new Date().getDate().toString());
        this.dateParam = paramDate;
        this.http.get('http://loto.halogi.com/result?date=' + paramDate).map(res => res.json()).subscribe((data) => {
            data.jackpot.split(",").forEach(i => {
                this.currentResult.push(this.helper.formatNumber(i));  // Format lại định dạng số trả về
            });
        })
    }

    public pickNumber(date) {
        this.navController.setRoot(PickPage, {date: this.dateParam});
    }
}

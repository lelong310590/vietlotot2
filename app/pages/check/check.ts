// Base import
import { Component } from '@angular/core';
import { NavController, Platform, NavParams, Page, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Toast, Splashscreen, DatePicker } from 'ionic-native';

// Services import
import { Helper } from '../../services/helper';

// Page import
import { PickPage } from '../../pages/pick/pick';
import { MapPage } from '../../pages/map/map';
import { TabPage } from '../../pages/tab/tab';
import { LuckyPage } from '../../pages/lucky/lucky';

@Component({
    templateUrl: 'build/pages/check/check.html',
    providers: [Helper]
})
export class CheckPage {

    private curentDate: string;
    private currentResult: Array<string> = [];
    private showNewestResult: boolean = true;
    private dateParam: any;

    private store: any;

    constructor(private platform: Platform, private loadingCtrl: LoadingController, private helper: Helper, private http: Http, private navController: NavController, public modalCtrl: ModalController, private viewCtrl: ViewController, private navParms: NavParams) {
    }

    onPageLoaded() {
        this.getCurrentResult();
        this.curentDate = this.helper.formatNumber(new Date().getDate().toString()) + '-' + this.helper.formatNumber((new Date().getMonth() + 1).toString()) + '-' + new Date().getFullYear().toString();
    }

    public pickNumber(date) {
        this.navController.setRoot(PickPage, {date: this.dateParam});
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
                                // console.log(toast);
                            }
                        );
                        loader.dismiss();
                    }
                );

                this.navController.viewDidLeave.subscribe(() => {
                    httpRequestListenner.unsubscribe();
                })
            }, (error) => {
                Toast.show('Không chọn được ngày tháng', '3000', 'center').subscribe(
                    toast => {
                        // console.log(toast);
                    }
                );
            })
        })
    }

    public mapView() {
        this.navController.setRoot(MapPage);
    }

    public luckyView() {
        this.navController.setRoot(LuckyPage);
    }

    public resultView() {
        this.navController.setRoot(TabPage);
    }

    public getCurrentResult() {
        this.curentDate = this.helper.formatNumber(new Date().getDate().toString()) + '-' + this.helper.formatNumber((new Date().getMonth() + 1).toString()) + '-' + new Date().getFullYear().toString();
        let paramDate = new Date().getFullYear().toString() + this.helper.formatNumber((new Date().getMonth() + 1).toString()) + this.helper.formatNumber(new Date().getDate().toString());
        this.dateParam = paramDate;
        this.http.get('http://loto.halogi.com/result?date=' + paramDate).map(res => res.json()).subscribe((data) => {
            data.jackpot.split(",").forEach(i => {
                this.currentResult.push(this.helper.formatNumber(i));  // Format lại định dạng số trả về
            });
        }, (error) => {
            Toast.show("Không tải được dữ liệu, Hãy kiểm tra lại kết nối mạng", '2500', 'bottom').subscribe(
                toast => {
                    // console.log(toast);
                }
            );
        })
    }
}
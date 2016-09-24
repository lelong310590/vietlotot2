// Base import
import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, ViewController, Page } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

// Plugin import
import { DatePicker, Toast } from 'ionic-native';

// Services import
import { Helper } from '../../services/helper';

// Page import
import { TabPage } from '../tab/tab';
import { CheckPage } from '../check/check';
import { MapPage } from '../../pages/map/map';
import { LuckyPage } from '../../pages/lucky/lucky';

@Component({
    templateUrl: 'build/pages/result/result.html',
    providers: [Helper]
})
export class ResultPage {

    private searchResultJackpot: Array<any> = [];
    private prizeResult: Array<any> = [];
    private returnResult: Array<any> = [];
    private returnprizeResult: Array<any> = [];

    private showNewestResult: boolean = true;

    constructor(public navController: NavController, private platform: Platform, private http: Http, private helper: Helper, private loadingCtrl: LoadingController, private viewCtrl: ViewController) {
        
    }

    onPageLoaded() {
        this.getDefaulResult();
    }

    public mapView() {
        this.navController.setRoot(MapPage);
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

    public datePicker() {
        this.platform.ready().then(() => {
            DatePicker.show({
                date: new Date(),
                mode: 'date',
                okText: 'Chọn',
                cancelText: 'Thoát',
                androidTheme: 5,
            }).then(
               (date) => {
                    let loader = this.loadingCtrl.create({
                        content: "Đang tải kết quả...",
                    });
                    loader.present();
                    
                    // let selectedDate = date.getFullYear().toString() + ' - ' + this.helper.formatNumber((date.getMonth() + 1).toString()) + ' - ' + this.helper.formatNumber(date.getDate().toString());
                    let dateStr = date.getFullYear().toString() + this.helper.formatNumber((date.getMonth() + 1).toString()) + this.helper.formatNumber(date.getDate().toString()); //Format lại định dạng ngày tháng
                    // console.log(dateStr);
                    let httpRequestListenner = this.http.get('http://loto.halogi.com/result?date=' + dateStr).map(res => res.json()).subscribe(
                        (data) => {

                            this.returnResult = []; // Xóa mảng kết quả trả về trước khi truyền vào dữ liệu mới
                            this.returnprizeResult = []; // Xóa mảng ball kết quả trả về trước khi truyền vào dữ liệu mới

                            this.showNewestResult = true;

                            this.returnResult.push(data); // Truyền vào dữ liệu mới dựa trên ngày tháng lấy được vào mảng
                            data.jackpot.split(",").forEach(i => {
                                this.returnprizeResult.push(this.helper.formatNumber(i));  // Format lại định dạng số trả về và truyền dữ liệu mới vào mảng
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
                        httpRequestListenner.unsubscribe();
                    })
                },
                (err) => {
                    console.log("Error occurred while getting date:", err);
                }
            );
        })
    }

    public getDefaulResult() {
        let loader = this.loadingCtrl.create({
            content: "Đang tải kết quả...",
        });
        loader.present();
        let date = new Date();
        let curentDate = date.getFullYear().toString() + this.helper.formatNumber((date.getMonth() + 1).toString()) + this.helper.formatNumber(date.getDate().toString()); //Format lại định dạng ngày tháng
        let httpRequestListenner = this.http.get('http://loto.halogi.com/result?date=' + curentDate).map(res => res.json()).subscribe(
            (data) => {
                this.searchResultJackpot.push(data);
                data.jackpot.split(",").forEach(i => {
                    this.prizeResult.push(this.helper.formatNumber(i));  // Format lại định dạng số trả về
                });

                this.navController.viewDidLeave.subscribe(() => {
                    httpRequestListenner.unsubscribe();
                })

                loader.dismiss();
                
            },
            (error) => {
                Toast.show("Không tải được dữ liệu, Hãy kiểm tra lại kết nối mạng", '2500', 'bottom').subscribe(
                    toast => {
                        console.log(toast);
                    }
                );
                loader.dismiss();
            }
        );
    }

    public closeView(No) {
        this.navController.setRoot(TabPage);
    }

}
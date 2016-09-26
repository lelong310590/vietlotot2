// Base import
import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, ViewController, NavParams, Page } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

// Plugin import
import { Toast, SpinnerDialog } from 'ionic-native';

// Services import
import { Helper } from '../../services/helper';

// Page import
import { PickPage } from '../pick/pick';

@Page({
    templateUrl: 'build/pages/check-result/check-result.html',
    providers: [Helper]
})
export class CheckResult { 

    private prizeResult: any = [];
    private resultStatus: boolean;
    private selectedBall: any;
    private prizeWin: any;
    private prizeTable: any;

    private prize1: any;
    private prize2: any;
    private prize3: any;
    private jackpot: any;

    constructor(private navParam: NavParams, 
                private viewCtrl: ViewController, 
                private http: Http, 
                private navController: NavController, 
                private helper: Helper, 
                private loadingCtrl: LoadingController) 
    {
        
    }

    onPageLoaded() {
        this.selectedBall = this.navParam.get('ball');
        console.log(this.selectedBall.find(8));
        if (this.navParam.get('data').total == 0) {
            this.resultStatus = false; // Không trúng
            this.getBallResultFail();
        } else {
            this.resultStatus = true; // Trúng giải
            this.getBallResultWin();
        }
    }

    public closeModal() {
        this.viewCtrl.dismiss();
    }

    public getBallResultFail() {
        let httpRequestListenner = this.http.get('http://loto.halogi.com/result?date=' + this.navParam.get('date')).map(res => res.json()).subscribe(
            (data) => {
                data.jackpot.split(",").forEach(i => {
                    this.prizeResult.push(this.helper.formatNumber(i));  // Format lại định dạng số trả về
                });
                // console.log(this.prizeResult);
                
            },
            (error) => {
                Toast.show("Không tải được dữ liệu, Hãy kiểm tra lại kết nối mạng", '2500', 'bottom').subscribe(
                    toast => {
                        // console.log(toast);
                    }
                );
            }
        );
    }

    public getBallResultWin() {
        console.log(this.navParam.get('data').detail);
        this.prizeWin = this.helper.formatMoney(this.navParam.get('data').total, 0, 'đ', ',', '.');
        this.prizeTable = this.navParam.get('data').detail;
        this.prize1 = this.helper.formatMoney(this.navParam.get('data').detail.prize1.price, '0', 'đ', ',', '.');
        this.prize2 = this.helper.formatMoney(this.navParam.get('data').detail.prize2.price, '0', 'đ', ',', '.');
        this.prize3 = this.helper.formatMoney(this.navParam.get('data').detail.prize3.price, '0', 'đ', ',', '.');
        this.jackpot = this.helper.formatMoney(this.navParam.get('data').detail.jackpot.price, '0', 'đ', ',', '.');
    }

}

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
    private prizeWin: number;
    private prizeTable: Array<any> = [];

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
        this.prizeWin = this.navParam.get('data').total;
        let httpRequestListenner = this.http.get('http://loto.halogi.com/result?date=' + this.navParam.get('date')).map(res => res.json()).subscribe(
            (data) => {
                this.prizeTable.push(data);
                // console.log(this.prizeTable);

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

}

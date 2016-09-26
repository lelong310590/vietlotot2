// Base import
import { Component } from '@angular/core';
import { NavController, Platform, NavParams, Page, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Toast } from 'ionic-native';

// Page import
import { MapPage } from '../../pages/map/map';
import { TabPage } from '../../pages/tab/tab';
import { CheckPage } from '../../pages/check/check';

@Component({
    templateUrl: 'build/pages/lucky/lucky.html'
})
export class LuckyPage {

    private store: any;

    constructor(private http: Http, private navController: NavController) { 

    }

    onPageLoaded() {
        let httpRequest = this.http.get('http://loto.halogi.com/store_lucky').map(res => res.json()).subscribe(data => {
            this.store = data;
            setTimeout(function() {
                httpRequest.unsubscribe();
            }, 2500);
        }, (error) => {
            Toast.show('Lỗi kết nối, vui lòng kiểm tra lại kết nối mạng', '3000', 'center').subscribe(
                toast => {
                    console.log(toast);
                }
            );
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
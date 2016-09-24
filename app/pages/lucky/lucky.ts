// Base import
import { Component } from '@angular/core';
import { NavController, Platform, NavParams, Page, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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
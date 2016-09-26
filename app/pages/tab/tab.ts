// Base import
import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

// Plugin import
import { Toast } from 'ionic-native';


// Page import
import { ResultPage } from '../../pages/result/result';
import { PickPage } from '../../pages/pick/pick';
import { MapPage } from '../../pages/map/map';
import { LuckyPage } from '../../pages/lucky/lucky';
import { CheckPage } from '../../pages/check/check';

@Component({
    templateUrl: 'build/pages/tab/tab.html',
})
export class TabPage {


    constructor(private navController: NavController) {
       
    }

    public resultPage() {
        this.navController.setRoot(ResultPage);
    }


    public mapView() {
        this.navController.setRoot(MapPage);
    }
    
    public checkView() {
        this.navController.setRoot(CheckPage);
    }

    public luckyView() {
        this.navController.setRoot(LuckyPage);
    }

    public commingSoon() {
        Toast.show("Tính năng này đang được phát triển", '2500', 'center').subscribe(
            toast => {
            }
        );
    }
    
    // public getCurrentResult() {
    //     this.curentDate = this.helper.formatNumber(new Date().getDate().toString()) + '-' + this.helper.formatNumber((new Date().getMonth() + 1).toString()) + '-' + new Date().getFullYear().toString();
    //     let paramDate = new Date().getFullYear().toString() + this.helper.formatNumber((new Date().getMonth() + 1).toString()) + this.helper.formatNumber(new Date().getDate().toString());
    //     this.dateParam = paramDate;
    //     this.http.get('http://loto.halogi.com/result?date=' + paramDate).map(res => res.json()).subscribe((data) => {
    //         data.jackpot.split(",").forEach(i => {
    //             this.currentResult.push(this.helper.formatNumber(i));  // Format lại định dạng số trả về
    //         });
    //     })
    // }

    
}

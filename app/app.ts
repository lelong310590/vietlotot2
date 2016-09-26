import { Component } from '@angular/core';
import { ionicBootstrap, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, ScreenOrientation  } from 'ionic-native';

import { TabPage } from './pages/tab/tab';


@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
    rootPage: any = TabPage;

    constructor(public platform: Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.overlaysWebView(true); // let status var overlay webview
			StatusBar.backgroundColorByHexString('#B71C1C');
            ScreenOrientation.lockOrientation('portrait');
            Splashscreen.hide();
        });
    }
    
}

ionicBootstrap(MyApp, [], {
    tabsHighlight: true,
    platforms: {
        ios: {
            pageTransition: 'ios',
            activator: 'highlight'
        },
        android: {
            pageTransition: 'md',
            activator: 'ripple'
        }
    }
});

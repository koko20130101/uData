import {Component} from '@angular/core';
import {Platform, Config} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {FirstRunPage} from '../pages/pages';
import {PlatformTotalPage} from '../pages/platform-total/platform-total';

import {TranslateService} from '@ngx-translate/core'

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    //第一个呈现的页面
    rootPage = FirstRunPage;

    constructor(private translate: TranslateService, private platform: Platform,private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
        this.initTranslate();
    }

    //当组件都加载完成后调用
    ionViewDidLoad() {
        //平台准备好后调用
        this.platform.ready().then(() => {
            // 平台已经准备好，插件也可以使用了
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    //初始化语言版本
    initTranslate() {
        //设置默认语言版本
        this.translate.setDefaultLang('zh');
        //如果浏览器语言版本存在的话
        if (this.translate.getBrowserLang() !== undefined) {
            this.translate.use(this.translate.getBrowserLang());
        } else {
            this.translate.use('zh'); //设置语言版本
        }

        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    }
}

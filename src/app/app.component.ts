import {Component} from '@angular/core';
import {Platform, Config, App} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {Device} from '@ionic-native/device';

import {FirstRunPage} from '../pages/pages';

import {GlobalVars} from  '../providers/services/global.service';
import {PopupFactory} from '../providers/factory/popup.factory';

import {TranslateService} from '@ngx-translate/core'

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    //第一个呈现的页面
    rootPage = FirstRunPage;
    backButtonPressed: boolean = false;  //用于判断返回键是否触发

    constructor(private translate: TranslateService,
                private platform: Platform,
                private app: App,
                private config: Config,
                private statusBar: StatusBar,
                public device: Device,
                public globalVars: GlobalVars,
                private popupFactory: PopupFactory) {
        this.initTranslate();

        //平台准备好后调用
        this.platform.ready().then(() => {
            //头部状态栏背景色
            this.statusBar.backgroundColorByHexString('#282836');
            //注册返回按键事件
            this.registerBackButtonAction();
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

    //安卓点击返回键
    registerBackButtonAction() {
        this.platform.registerBackButtonAction(() => {
            //如果当前活动页面不能返回
            if (!this.app.getActiveNav().canGoBack()) {
                this.exitApp()
            }else{
                //返回上一页面
                this.app.goBack();
            }
        }, 1);
    }

    //双击退出提示框
    exitApp() {
        if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
            this.platform.exitApp();
        } else {
            this.popupFactory.showToast({
                message: '再按一次退出应用',
                duration: 2000,
                position: 'bottom'
            });
            this.backButtonPressed = true;
            setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
        }
    }
}

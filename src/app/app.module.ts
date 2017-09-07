import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, Http} from '@angular/http';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {Storage, IonicStorageModule} from '@ionic/storage';

import {MyApp} from './app.component';

import {HomePage} from  '../pages/home/home';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {LoginPage} from '../pages/login/login';
import {PlatformTotalPage} from '../pages/platform-total/platform-total';
import {C2bPage} from '../pages/c2b/c2b';
import {LingXiPage} from '../pages/lingxi/lingXi';
import {BankListPage} from '../pages/bank-list/bank-list';
import {BankDetailPage} from '../pages/bank-detail/bank-detail';
import {HelpPage} from '../pages/help/help';
import {SettingsPage} from '../pages/settings/settings';
import {PopOverPage} from '../pages/public/popover';
import {Date} from '../pages/public/date';
import {Unit} from '../pages/public/unit';
import {ListPlatform} from '../pages/public/list-platform';
import {InfoItem} from '../pages/public/info-item';

import {Api} from '../providers/api';
import {Settings} from '../providers/settings';
import {PublicFactory} from '../providers/providers';
import {PopupFactory} from '../providers/providers';
import {StorageFactory} from '../providers/providers';
import {Crypto} from '../providers/providers';
import {User} from '../providers/services/user.service';
import {GlobalVars} from '../providers/services/global.service';
import {DateService} from '../providers/services/date.service';
import {ListPipe} from '../providers/pipes/list.pipe';

import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Device} from '@ionic-native/device';
import {Network} from '@ionic-native/network';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {MyECharts} from '../directives/echarts.directive';


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
    /**
     * The Settings provider takes a set of default settings for your app.
     *
     * You can add new settings options at any time. Once the settings are saved,
     * these values will not overwrite the saved values (this can be done manually if desired).
     */
    return new Settings(storage, {
        option1: true,
        option2: 'Ionitron J. Framework',
        option3: '3',
        option4: 'Hello'
    });
}

@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        HomePage,
        PlatformTotalPage,
        C2bPage,
        LingXiPage,
        BankListPage,
        BankDetailPage,
        HelpPage,
        SettingsPage,
        TutorialPage,
        PopOverPage,
        Date,
        Unit,
        ListPlatform,
        InfoItem,
        MyECharts
    ],
    imports: [
        BrowserModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        }),
        IonicModule.forRoot(MyApp, {
            //设置app
            //二级页面隐藏底部菜单
            tabsHideOnSubPages: true,
            //导航位置
            tabsPlacement: 'bottom',
            backButtonText: '',
            // pageTransition: 'ios-transition',
            // iconMode: 'ios',
            // activator:'highlight'
            menuType: 'overlay',  //菜单进入方式
            platforms: {
                ios: {
                    menuType: 'overlay',
                }
            }
        }),
        IonicStorageModule.forRoot(),
        // MyECharts
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        HomePage,
        PlatformTotalPage,
        C2bPage,
        LingXiPage,
        BankListPage,
        BankDetailPage,
        HelpPage,
        SettingsPage,
        TutorialPage,
        PopOverPage,
        Date,
        Unit,
        ListPlatform,
        InfoItem
    ],
    providers: [
        Api,
        User,
        PublicFactory,
        PopupFactory,
        StorageFactory,
        Crypto,
        GlobalVars,
        DateService,
        ListPipe,
        SplashScreen,
        StatusBar,
        Device,
        Network,
        {provide: Settings, useFactory: provideSettings, deps: [Storage]},
        // Keep this to enable Ionic's runtime error handling during development
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, Http} from '@angular/http';
import {Storage, IonicStorageModule} from '@ionic/storage';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Device} from '@ionic-native/device';
import {Network} from '@ionic-native/network';
import {IonicApp, IonicModule,IonicErrorHandler} from 'ionic-angular';

import {MyApp} from './app.component';
import {PopoverPage} from '../components/popover/popover';

import {Api} from '../providers/providers';
import {Settings} from '../providers/providers';
import {PublicFactory} from '../providers/providers';
import {PopupFactory} from '../providers/providers';
import {StorageFactory} from '../providers/providers';
import {Crypto} from '../providers/providers';
import {User} from '../providers/providers';
import {GlobalVars} from '../providers/providers';
import {DateService} from '../providers/services/date.service';
import {ListPipe} from '../pipes/list/list';



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
        PopoverPage,
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
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        PopoverPage,
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
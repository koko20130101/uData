import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from './home';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../components/shared.module';

@NgModule({
    declarations: [
        HomePage
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        TranslateModule.forChild(),
        SharedModule
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule {
}

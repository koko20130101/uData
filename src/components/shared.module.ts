import { NgModule } from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import { UcsDate } from './date/date';
import { UcsUnit } from './unit/unit';
import { InfoItem } from './info-item/info-item';
import { ListPlatform } from './list-platform/list-platform';

@NgModule({
	declarations: [
		UcsDate,
		UcsUnit,
		InfoItem,
		ListPlatform
	],
	imports: [
		IonicPageModule.forChild(UcsDate),
		IonicPageModule.forChild(UcsUnit),
		IonicPageModule.forChild(InfoItem),
		IonicPageModule.forChild(ListPlatform),
	],
	exports: [
		UcsDate,
		UcsUnit,
		InfoItem,
		ListPlatform
	]
})
export class SharedModule {}

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import co from 'co';

import {HomePage} from '../home/home';
import {BankListPage} from '../bank-list/bank-list';
import {LoginPage} from '../login/login';

import {TranslateService} from '@ngx-translate/core';
import {User} from '../../providers/services/user.service';
import {DateService} from '../../providers/services/date.service';
import {GlobalVars} from  '../../providers/services/global.service';

import {PopupFactory} from '../../providers/factory/popup.factory';
import {PublicFactory} from '../../providers/factory/public.factory';


export interface Slide {
    title: string;
    description: string;
    image: string;
}

@Component({
    selector: 'page-tutorial',
    templateUrl: 'tutorial.html'
})
export class TutorialPage {
    slides: Slide[];
    showSkip = true;
    isLogged: boolean = false;
    count = 5;  //启动页倒计时
    errorCount:any;
    myInterval: any;
    dataInstance: any;

    constructor(public navCtrl: NavController,
                public user: User,
                public globalVars: GlobalVars,
                public popupFactory: PopupFactory,
                public publicFactory: PublicFactory,
                public dateService: DateService,
                public translate: TranslateService) {
        translate.get(["TUTORIAL_SLIDE1_TITLE",
            "TUTORIAL_SLIDE1_DESCRIPTION",
            "TUTORIAL_SLIDE2_TITLE",
            "TUTORIAL_SLIDE2_DESCRIPTION",
            "TUTORIAL_SLIDE3_TITLE",
            "TUTORIAL_SLIDE3_DESCRIPTION",
        ]).subscribe(
            (values) => {
                console.log('Loaded values', values);
                this.slides = [
                    {
                        title: values.TUTORIAL_SLIDE1_TITLE,
                        description: values.TUTORIAL_SLIDE1_DESCRIPTION,
                        image: 'assets/img/ica-slidebox-img-1.png',
                    },
                    {
                        title: values.TUTORIAL_SLIDE2_TITLE,
                        description: values.TUTORIAL_SLIDE2_DESCRIPTION,
                        image: 'assets/img/ica-slidebox-img-2.png',
                    },
                    {
                        title: values.TUTORIAL_SLIDE3_TITLE,
                        description: values.TUTORIAL_SLIDE3_DESCRIPTION,
                        image: 'assets/img/ica-slidebox-img-3.png',
                    }
                ];
            });
    }

    ngOnInit() {
        this.dataInstance = this.globalVars.getInstance();
    }


    ionViewDidLoad() {

        //订阅请求错误信息
        this.publicFactory.error.subscribe((data)=> {
            console.log(data)
            if (this.errorCount == 0) {
                let toast = this.popupFactory.showToast({
                    message: '<i class="icon icon-ios ion-ios-warning toast-icon" ></i>' + data.message,
                    duration: 3000,
                    position: 'top'
                });
                toast.onDidDismiss(()=> {
                    this.errorCount = 0;
                    console.log(this.errorCount);
                })
            }
            this.errorCount++;
        });
    }

    ionViewWillEnter() {
        console.log(2);
        //视图加载完成时启用倒计时
        this.myInterval = setInterval(()=> {
            this.count--;
            if (this.count == 0) {
                this.startApp()
            }
        }, 1000);

        co(function *() {
            let loginStatus: any = yield this.user.checkLogin({});
            let userPower: any = {};
            if (loginStatus.code == 1) {
                userPower = yield this.user.getUserPower();
            }
            if (userPower.code == 1) {
                let _date = this.dateService.getValue();
                //如果没有数据返回，则向服务器请求
                if (!_date) {
                    this.dateService.loadDateList({}).subscribe(data => {
                        let res: any = data;
                        if (res._body.code == 1) {
                            this.isLogged = true;
                            this.globalVars.setDateValue(res._body.data);
                        }
                    });
                } else {
                    //设置全局变量
                    this.isLogged = true;
                    this.globalVars.setDateValue(_date);
                }
            }
        }.bind(this));
    }

    ionViewWillUnload() {
        console.log(4);
        //取消选择单位订阅
        this.publicFactory.error.observers.pop();
    }



    ionViewWillLeave() {

    }

    //进入应用
    startApp() {
        clearInterval(this.myInterval);
        if (this.isLogged) {
            if (this.dataInstance.adminCode['06']) {
                this.navCtrl.setRoot(HomePage, {}, {
                    animate: true,
                    direction: 'forward'
                });
            } else if (this.dataInstance.adminCode['13']) {
                this.navCtrl.setRoot(BankListPage, {}, {
                    animate: true,
                    direction: 'forward'
                })
            } else {
                this.popupFactory.showAlert({
                    title:'提示',
                    message:'您还未开通数据查看权限，请联系管理员！'
                })
            }
        } else {
            this.navCtrl.setRoot(LoginPage,{},{
                animate: true,
                direction: 'forward'
            });
        }
    }

    onSlideChangeStart(slider) {
        //显示跳过按钮
        this.showSkip = !slider.isEnd();
    }

}

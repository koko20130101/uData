import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Device} from '@ionic-native/device';
import {StatusBar} from '@ionic-native/status-bar';

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
    image: string;
}

@Component({
    selector: 'page-tutorial',
    templateUrl: 'tutorial.html'
})
export class TutorialPage {
    slides: Slide[]=[];
    showSkip = true;
    isLogged: boolean = false;
    count = 6;  //启动页倒计时
    errorCount:any;
    myInterval: any;
    dataInstance: any;

    constructor(public navCtrl: NavController,
                public dateService: DateService,
                public user: User,
                public globalVars: GlobalVars,
                public popupFactory: PopupFactory,
                public publicFactory: PublicFactory,
                public device:Device,
                private statusBar:StatusBar,
                public translate: TranslateService) {

    }

    ngOnInit() {
        this.dataInstance = this.globalVars.getInstance();
    }
    ionViewDidLoad() {
        //订阅请求错误信息
        this.publicFactory.error.subscribe((data)=> {
            if (this.errorCount == 0) {
                let toast = this.popupFactory.showToast({
                    message: '<i class="icon icon-ios ion-ios-warning toast-icon" ></i>' + data.message,
                    duration: 3000,
                    position: 'top'
                });
                toast.onDidDismiss(()=> {
                    this.errorCount = 0;
                    console.log(this.errorCount);
                });
            }
            this.errorCount++;
        });
    }

    ionViewWillEnter() {
        this.statusBar.hide();
    }
    ionViewDidEnter(){
        let _timeout = setTimeout(function () {
            //设备唯一识别码
            this.dataInstance.sendMassage.head.UUID = this.device.uuid;
            //设备制造商
            this.dataInstance.sendMassage.head.manufacturer = this.device.manufacturer;
            //设备硬件序列号
            this.dataInstance.sendMassage.head.serial = this.device.serial;
            //操作系统名称
            this.dataInstance.sendMassage.head.platform = this.device.platform;
            //操作系统版本
            this.dataInstance.sendMassage.head.oSVersion = this.device.version;

            co(function *() {
                let loginStatus: any = yield this.user.checkLogin({});
                let userPower: any = {};
                let tutorial: any = {};
                if (loginStatus.code == 1) {
                    this.dataInstance.cryptKey = loginStatus.data.key;
                    userPower = yield this.user.getUserPower();
                    //加载启动页面
                    tutorial = yield this.user.getTutorials();
                    this.slides = tutorial.data;
                }else{
                    this.isLogged = false;
                    this.startApp();
                    return;
                }
                if (userPower.code == 1) {
                    //延迟加载日期列表，因为从本地读日期列表要时间
                    let myTimeOut = setTimeout(function () {
                        let _date = this.dateService.getValue();
                        //如果没有数据返回，则向服务器请求
                        if (!_date) {
                            this.dateService.loadDateList({}).subscribe(data => {
                                let res: any = data;
                                if (res._body.code == 1) {
                                    this.isLogged = true;
                                    this.dataInstance.setDateValue(res._body.data);
                                    //判断是否有启动广告
                                    if(this.slides.length==0) {
                                        this.showSkip = false;
                                        this.startApp()
                                    }else{
                                        this.doInterval();
                                    }
                                }
                            });
                        } else {
                            //设置全局变量
                            this.isLogged = true;
                            this.dataInstance.setDateValue(_date);
                            //判断是否有启动广告
                            if(this.slides.length==0) {
                                this.showSkip = false;
                                this.startApp()
                            }else{
                                this.doInterval();
                            }
                        }
                        clearTimeout(myTimeOut);
                    }.bind(this),300);
                }
            }.bind(this));

            clearTimeout(_timeout);
        }.bind(this), 1000);
    }

    ionViewWillUnload() {
        console.log(4);
        //取消选择单位订阅
        this.publicFactory.error.observers.pop();
    }

    ionViewWillLeave() {

    }

    doInterval(){
        //加载完成时启用倒计时
        this.myInterval = setInterval(()=> {
            this.count--;
            if (this.count == 0) {
                this.startApp();
            }
        }, 1000);
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
        this.showSkip = false;
        clearInterval(this.myInterval);
    }
}
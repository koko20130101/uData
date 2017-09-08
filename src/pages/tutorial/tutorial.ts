import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Network} from '@ionic-native/network';

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
    slides: Slide[] = [];
    showCount: boolean = true;
    showSkip: boolean = false;
    isLogged: boolean = false;
    //是否第一次访问网络
    firstConnect:boolean = true;
    count = 6;  //启动页倒计时
    errorCount: any = 0;
    myInterval: any;
    dataInstance: any;
    myToast:any;

    errorSubscription:any;
    connectSubscription:any;
    disConnectSubscription:any;

    constructor(public navCtrl: NavController,
                public dateService: DateService,
                public user: User,
                public globalVars: GlobalVars,
                public popupFactory: PopupFactory,
                public publicFactory: PublicFactory,
                public network: Network,
                public translate: TranslateService) {

    }

    ngOnInit() {
        // console.log(1)
        this.dataInstance = this.globalVars.getInstance();
    }
    ngAfterViewInit(){

    }
    ionViewDidLoad() {
        // console.log(2)
        //订阅请求错误信息
        this.errorSubscription = this.publicFactory.error.subscribe((data)=> {
            console.log(this.publicFactory.error)
            if (this.errorCount == 0) {
                this.myToast = this.popupFactory.showToast({
                    message: data.message,
                    // message: '<i class="icon icon-ios ion-ios-warning toast-icon" ></i>' + data.message,
                    duration: data.duration || 5000,
                    position: 'top'
                });
                this.myToast.onDidDismiss(()=> {
                    this.errorCount = 0;
                });
            }
            this.errorCount++;
        });
    }

    ionViewWillEnter() {
        if(this.network.type=='none'){
            this.publicFactory.error.emit({
                message: '断网了，请检查网络！',
                duration: 1000000,
            })
        }
        //订阅断网
        this.disConnectSubscription = this.network.onDisconnect().subscribe(() => {
            this.publicFactory.error.emit({
                message: '断网了，请检查网络！',
                duration: 1000000,
            });
            this.firstConnect = false;
        });
        //订阅连网
        this.connectSubscription = this.network.onConnect().subscribe(() => {
            this.myToast.dismiss();
            if(!this.firstConnect) {
                this.count = 1;
                this.connectServer();
            }
        });
    }

    ionViewDidEnter() {
        this.connectServer();
    }

    ionViewWillLeave() {
        // console.log(6)
        //取消订阅
        this.errorSubscription.unsubscribe();
        this.connectSubscription.unsubscribe();
        this.disConnectSubscription.unsubscribe();
    }

    doInterval() {
        //加载完成时启用倒计时
        this.myInterval = setInterval(()=> {
            this.count--;
            if (this.count == 0) {
                this.startApp();
            }
        }, 1000);
    }

    connectServer(){
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
            } else {
                this.isLogged = false;
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
                                if (this.slides.length == 0) {
                                    this.showSkip = false;
                                    this.startApp()
                                } else {
                                    this.showSkip = true;
                                    this.doInterval();
                                }
                            }
                        });
                    } else {
                        //设置全局变量
                        this.isLogged = true;
                        this.dataInstance.setDateValue(_date);
                        //判断是否有启动广告
                        if (this.slides.length == 0) {
                            this.showSkip = false;
                            this.startApp()
                        } else {
                            this.showSkip = true;
                            this.doInterval();
                        }
                    }
                    clearTimeout(myTimeOut);
                }.bind(this), 300);
            }
        }.bind(this));
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
                    title: '提示',
                    message: '您还未开通数据查看权限，请联系管理员！'
                })
            }
        } else {
            this.navCtrl.setRoot(LoginPage, {}, {
                animate: true,
                direction: 'forward'
            });
        }
    }

    onSlideChangeStart(slider) {
        //显示跳过按钮
        this.showCount = false;
        clearInterval(this.myInterval);
    }
}
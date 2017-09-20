import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage,NavController} from 'ionic-angular';
import {Device} from '@ionic-native/device';
import {StatusBar} from '@ionic-native/status-bar';
import co from 'co';

import {User} from  '../../providers/services/user.service';
import {GlobalVars} from '../../providers/providers';
import {PopupFactory} from '../../providers/providers';
import {PublicFactory} from '../../providers/providers';
import {ValidatorFactory} from '../../providers/providers';
import {DateService} from '../../providers/services/date.service';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    //子元素 #hackerBox  #hacker
    @ViewChild("hackerBox") hackerBox: ElementRef;
    @ViewChild("hacker") hacker: ElementRef;
    loader:any;
    myToast:any;
    errorCount:any;
    globalInstance: any;
    private hackerInterval;
    imgCodeLink: any;
    count: any;
    // 登录表单的账户字段
    private account: { mobile: string, imgCode: string,smsCode: string  } = {
        mobile: '',
        imgCode: '',
        smsCode: ''
    };

    errorSubscription: any;

    constructor(public navCtrl: NavController,
                public device:Device,
                public statusBar: StatusBar,
                public user: User,
                public dateService: DateService,
                public globalVars: GlobalVars,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory) {

    }

    ngOnInit() {
        this.globalInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        let hackerBox = this.hackerBox.nativeElement;
        let canvas = this.hacker.nativeElement;
        //把外层DIV的宽和高赋值给canvas
        let width = canvas.width = hackerBox.offsetWidth;
        let height = canvas.height = hackerBox.offsetHeight;
        let letters: any = new Array(100).join('1').split('');

        /**
         * 黑客帝国数字雨效果
         * */
        let draw = function () {

            canvas.getContext('2d').fillStyle = 'rgba(0,0,0,.05)';
            canvas.getContext('2d').fillRect(0, 0, width, height);
            canvas.getContext('2d').fillStyle = '#0F0';

            letters.map(function (y_pos, index) {
                let text = String.fromCharCode(/*3e4*/ 49 + Math.random() * 33);
                let x_pos = index * 10;
                canvas.getContext('2d').fillText(text, x_pos, y_pos);
                letters[index] = (y_pos > 200 + Math.random() * 1e4) ? 0 : y_pos + 10;
            });
        };
        this.hackerInterval = setInterval(draw, 33);
        this.getImgCode();
    }

    ionViewDidEnter(){
        this.statusBar.show();
    }

    ionViewDidLoad() {
        //订阅请求错误信息
        this.errorSubscription = this.publicFactory.error.subscribe((data) => {
            if(data.type == 0) {
                this.myToast = this.popupFactory.showToast({
                    message: data.message,
                    // message: '<i class="icon icon-ios ion-ios-warning toast-icon" ></i>' + data.message,
                    duration: data.duration || 3000,
                    position: data.position || 'top'
                });
                this.myToast.onDidDismiss(()=> {
                    this.errorCount = 0;
                });
            }
            if(data.type == 1) {
                this.popupFactory.showAlert({
                    message: data.message
                });
            }
        });
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.errorSubscription.unsubscribe();
    }


    /**
     * 当视图离开时
     * */
    ionViewDidLeave() {
        //删除nav堆栈：从0开始，删除1个
        // this.navCtrl.remove(0, 1);
        //删除interval
        clearInterval(this.hackerInterval);
    }

    //验证表单
    validateForm() {
        //验证对象实例
        let validator = new ValidatorFactory();
        validator.addStrategy(this.account.mobile, [{
            strategy: 'isNonEmpty',
            errorMsg: '手机号码不能为空'
        }, {
            strategy: 'isMobile',
            errorMsg: '手机号码格式不正确'
        }]);

        validator.addStrategy(this.account.imgCode, [{
            strategy: 'isNonEmpty',
            errorMsg: '图形验证码不能为空'
        }]);

        validator.addStrategy(this.account.smsCode, [{
            strategy: 'isNonEmpty',
            errorMsg: '图形验证码不能为空'
        }]);

        //开始验证
        let errorMsg = validator.startValidate();
        return errorMsg;
    }

    doLogin() {
        let errorMsg = this.validateForm();
        if (!!errorMsg) {
            this.popupFactory.showToast({
                message: errorMsg
            });
            return false;
        }
        this.loader = this.popupFactory.loading();
        this.loader.present();
        co(function *() {
            let loginStatus: any = yield this.user.login(this.account);
            let userPower: any = {};
            if (loginStatus.code == 1) {
                userPower = yield this.user.getUserPower();
            }

            if(!!this.loader) {
                this.loader.dismiss();
            }

            if (userPower.code == 1) {
                this.dateService.loadDateList({}).subscribe(
                    data => {
                        let res: any = data;
                        if (res._body.code == 1) {
                            this.globalInstance.setDateValue(res._body.data);
                            if (this.globalInstance.adminCode['06']) {
                                this.navCtrl.setRoot('HomePage', {}, {
                                    animate: true,
                                    direction: 'forward'
                                });
                            } else if (this.globalInstance.adminCode['13']) {
                                this.navCtrl.setRoot('BankListPage', {}, {
                                    animate: true,
                                    direction: 'forward'
                                })
                            } else {
                                this.popupFactory.showAlert({
                                    title: '提示',
                                    message: '您还未开通数据查看权限，请联系管理员！'
                                })
                            }
                        }
                    });
            }

        }.bind(this));
    }

    getImgCode() {
        this.imgCodeLink = 'https://reportcenterapi.ucsmy.com/View/Web/GetImageCode.ashx?' + Math.random();
    }

    //获取短信验证码
    getSmsCode() {
        //验证对象实例
        let validator = new ValidatorFactory();
        validator.addStrategy(this.account.mobile, [{
            strategy: 'isNonEmpty',
            errorMsg: '手机号码不能为空'
        }, {
            strategy: 'isMobile',
            errorMsg: '手机号码格式不正确'
        }]);

        validator.addStrategy(this.account.imgCode, [{
            strategy: 'isNonEmpty',
            errorMsg: '图形验证码不能为空'
        }]);
        //开始验证
        let errorMsg = validator.startValidate();
        if (!!errorMsg) {
            this.popupFactory.showToast({
                message: errorMsg
            });
            return false;
        }

        let _sendData: any = {
            mobile: this.account.mobile,
            imgCode: this.account.imgCode
        };
        this.user.loadSmsCode(_sendData).subscribe((data)=> {
            let res: any = data;
            if (res._body.code == 1) {
                this.count = 60;
                let myInterval = setInterval(()=> {
                    this.count--;
                    if (this.count == 0) {
                        this.count = null;
                        clearInterval(myInterval)
                    }
                }, 1000);
            }
        });
    }
}

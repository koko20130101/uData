import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import co from 'co';

import {HomePage} from '../home/home';
import {BankListPage} from '../bank-list/bank-list';

import {User} from  '../../providers/services/user.service';
import {GlobalVars} from '../../providers/providers';
import {PopupFactory} from '../../providers/providers';
import {PublicFactory} from '../../providers/providers';
import {DateService} from '../../providers/services/date.service';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    //子元素 #hackerBox  #hacker
    @ViewChild("hackerBox") hackerBox: ElementRef;
    @ViewChild("hacker") hacker: ElementRef;
    globalInstance:any;
    private hackerInterval;
    // 登录表单的账户字段
    private account: { mobile: string, password: string } = {
        mobile: '',
        password: ''
    };

    constructor(public navCtrl: NavController,
                public user: User,
                public dateService:DateService,
                public globalVars:GlobalVars,
                public publicFactory:PublicFactory,
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

    doLogin() {
        co(function *() {
            let loader = this.popupFactory.loading();
            loader.present();

            let loginStatus:any = yield this.user.login(this.account);
            let userPower: any = {};
            if (loginStatus.code == 1) {
                userPower = yield this.user.getUserPower();
            }
            if (userPower.code == 1) {
                this.dateService.loadDateList({}).subscribe(data => {
                    let res: any = data;
                    if (res._body.code == 1) {
                        this.globalInstance.setDateValue(res._body.data);
                        if (this.globalInstance.adminCode['06']) {
                            this.navCtrl.setRoot(HomePage, {}, {
                                animate: true,
                                direction: 'forward'
                            });
                        } else if (this.globalInstance.adminCode['13']) {
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
                        loader.dismiss();
                    }
                });
            }
        }.bind(this));
    }
}

import {Component} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';

import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';

import {User} from '../../providers/user';
import {DateService} from '../../providers/services/date';
import {GlobalVars} from  '../../providers/global-vars';

import {TranslateService} from '@ngx-translate/core';


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
    isLogined: boolean = false;
    count = 5;  //启动页倒计时
    myInterval: any;

    constructor(public navCtrl: NavController,
                public user: User,
                public globalVars:GlobalVars,
                public dateService:DateService,
                public menu: MenuController, translate: TranslateService) {
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

    ngAfterViewInit() {

    }

    ionViewDidLoad() {
        // console.log(abc)
        //视图加载完成时启用倒计时
        this.myInterval = setInterval(()=> {
            this.count--;
            if (this.count == 0) {
                this.startApp()
            }
        }, 1000);

        //检查是否登录
        this.user.checkLogin({}).subscribe(resp => {
            let res: any = resp;
            if (res._body.code == 1) {
                this.isLogined = true;
                //从dateService服务中获取时间列表
                this.dateService.getValue().then(data=> {
                    //如果没有数据返回，则向服务器请求
                    if (!data) {
                        this.dateService.loadDateList({})
                    }else{
                        //设置全局变量
                        this.globalVars.setDateValue(data);
                    }
                });
                // console.log(this.dateService._dateList());
            }
        }, err => {

        });
    }

    ionViewDidEnter() {
        // 禁用侧栏菜单
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // 使用侧栏菜单
        this.menu.enable(true);
    }

    //进入应用
    startApp() {
        clearInterval(this.myInterval);
        if (this.isLogined) {
            this.navCtrl.setRoot(HomePage, {}, {
                animate: true,
                direction: 'forward'
            });
        } else {
            this.navCtrl.push(LoginPage);
        }
    }

    onSlideChangeStart(slider) {
        //显示跳过按钮
        this.showSkip = !slider.isEnd();
    }

}

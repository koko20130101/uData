import {Injectable} from '@angular/core';
import {AlertController, ToastController,LoadingController} from 'ionic-angular';

@Injectable()
export class PopupFactory {
    constructor(private alertCtrl: AlertController,
                private loadingCtrl:LoadingController,
                private toastCtrl: ToastController) {
    }

    /**
     * 弹窗
     * this.popupFactory.showAlert({
     *                       message:'提示文案'
     *     });
     *
     *
     * */
    public showAlert(config?) {
        let alertConfig = {
            cssClass:'my-alert',
            buttons:[
                {
                    text:'确 定',
                    handler:()=>{

                    }
                }
            ]
        };
        Object.assign(alertConfig, config);
        let alert = this.alertCtrl.create(alertConfig);
        alert.present();
    }

    /**
     * loading
     * */
    public loading(config?) {
        let loaderConfig = {
            duration:10000,
            cssClass:'my-loading',
            // dismissOnPageChange:true
        };
        Object.assign(loaderConfig, config);
        let loader = this.loadingCtrl.create(loaderConfig);
        return loader;
    }

    /**
     * 泡泡提示
     * this.popup.showToast({
     *              message:'提示文字'
     *        });
     * */
    public showToast(config) {
        let toastConfig = {
            message: '',
            duration: 1200,
            position: 'middle',
            cssClass: 'my-toast',
            dismissOnPageChange: true
        };
        Object.assign(toastConfig, config);
        let toast = this.toastCtrl.create(toastConfig);
        toast.present();
        return toast;
    }
}
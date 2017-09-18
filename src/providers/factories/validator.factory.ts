import {Injectable} from '@angular/core';

@Injectable()
export class ValidatorFactory {

    //策略对象
    private strategies = {
        //不能为空
        isNonEmpty: function (value, errorMsg) {
            if (!value || value === '') {
                return errorMsg;
            }
        },
        //验证长度
        minLength: function (value, length, errorMsg) {
            if (value.length < length) {
                return errorMsg;
            }
        },
        //数字类型
        isNumber: function (value, errorMsg) {
            if (!/(^[0-9]*$)/.test(value)) {
                return errorMsg;
            }
        },
        //数字类型
        isMoney: function (value, errorMsg) {
            if (!/(^[0-9]+(.[0-9]{1,2})?$)/.test(value)) {
                return errorMsg;
            }
        },
        //验证手机号
        isMobile: function (value, errorMsg) {
            if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                return errorMsg;
            }
        },
        //验证密码格式
        isPassword: function (value, errorMsg) {
            if (!/^[a-zA-Z]\S{5,15}/ig.test(value)) {
                return errorMsg;
            }
        },
        //验证身份证
        isIdCard: function (value, errorMsg) {
            if (!/\d{3}$/.test(value)) {
                return errorMsg;
            }
        }
    };
    private cache:any[]=[]; //缓存验证方法列表
    //添加策略
    public addStrategy(value,rules){
        let self=this;
        for(let rule of rules) {
            let strategyAry:any[] = rule.strategy.split(':');
            let errorMsg =rule.errorMsg;
            self.cache.push(function () {
                let strategy = strategyAry.shift();
                strategyAry.unshift(value);
                strategyAry.push(errorMsg);
                return self.strategies[strategy].apply(self, strategyAry);
            });
        }
    }

    //开始验证
    public  startValidate(){
        for(let validatorFunc in this.cache) {
            let errorMsg = this.cache[validatorFunc]();
            if(errorMsg) {
                return errorMsg
            }
        }
    }

}
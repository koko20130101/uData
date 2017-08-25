import {Injectable, Pipe} from '@angular/core';

/*@Pipe({
    name: 'ListPipe'
})*/
@Injectable()
export class ListPipe {
    constructor(){

    }
    //内容筛选
    transform(value, conditions?) {
        //要筛选的字段
        let [minRate, maxRate,minTerm,maxTerm] = conditions;
        return value.filter(data => {
            return data.InvestmentInterest >= +minRate &&
                data.InvestmentInterest <= +maxRate &&
                data.Duration >= minTerm &&
                data.Duration <= maxTerm;
        });
    }
    //数组排序 order(要排序的数组,排序字段,升0降1）
    orderBy(value,conditions?,direction?){
        return value.sort((a:any,b:any)=>{
            for(let cot of conditions) {
                let cot1 = a[cot];
                let cot2 = b[cot];
                if (cot1 < cot2) {
                    return direction ? 1:-1;
                } else if (cot1 > cot2) {
                    return direction ? -1:1;
                } else {
                    return 0;
                }
            }
        })
    }
}
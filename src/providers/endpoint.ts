// export const HOST = 'https://example.com/api/v1/';
// export const HOST = 'http://172.17.2.73:8100';
export const HOST = 'http://localhost:8100';
// export const HOST = 'http://172.17.20.31:8080/';
// export const HOST = 'http://192.168.0.102:8080';

//接口
export const Endpoint = {
    getImgCode: 'captcha',     //获取图形验证码
    getSmsCode: 'getVerifyCode',     //获取短信
    login: 'assets/data/user.json',   //登录
    checkLogin:'assets/data/check-login.json',  //检查登录及版本信息
    dateList:'assets/data/date-list.json',  //日期列表
    signOut:'user/signOut',          //登出
};
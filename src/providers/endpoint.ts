// export const HOST = 'https://example.com/api/v1/';
// export const HOST = 'http://172.17.2.73:8100';
export const HOST = 'http://localhost:8100';
// export const HOST = 'http://172.17.20.31:8080/';
// export const HOST = 'http://192.168.0.102:8080';

export const Endpoint = {
    addSubWork:'addSubWork',  //保存子任务
    getImgCode: 'captcha',     //获取图形验证码
    getSmsCode: 'getVerifyCode',     //获取短信
    login: 'assets/data/user.json',   //登录
    checkLogin:'assets/data/check-login.json',  //检查登录及版本信息
    dateList:'assets/data/date-list.json',  //日期列表
    signOut:'user/signOut',          //登出
    register: 'user/register',     //注册
    getUserInfo:'user/userInfo',   //用户信息
    updateUserInfo:'user/updateUserInfo',   //用户信息
    teamsList:'teamsList',   // 团队列表
    teamsRanking:'teamsRanking', //团队业绩排行
    membersWork:'membersWork', //成员工作
    teamWorks:'teamWorks', //团队工作
    getSubWorkList:'subWorkList',  //获取子任务
    acceptWork:'acceptWork',  //接受任务
    startWork:'startWork',  //开始任务
    letGoSubWork:'letGoSubWork',  //放弃任务
    acceptSubWorkItem:'acceptSubWorkItem',  //接受单个子任务
    joinTeam:'joinTeam', //加入团队
    signOutTeam:'signOutTeam', //加入团队
    updateSubWork:'updateSubWork',  //更新子任务
    adminWorkList:'admin/workList', //任务管理列表
    teamMembers:'admin/teamMember', //获取团队成员

    adminDeleteSubWork:'admin/deleteSubWorkItem',  //删除子任务
    adminEditWork:'admin/editWork',  //编辑任务
    adminEditSubWork:'admin/editSubWork', //编辑子任务
    adminTeamList:'admin/teamList', //获取团队列表
    adminAddTeam:'admin/addTeam', //创建团队
    adminDeleteTeam:'admin/delTeam', //创建团队
    adminExamineUser:'admin/examineUser', //加入团队
    adminDelMember:'admin/deleteMember', //加入团队
};